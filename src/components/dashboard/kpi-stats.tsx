import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { BedDouble, CalendarDays, ReceiptEuro } from "lucide-react"

export function KPIStats() {
    const { data, isLoading } = useQuery({
        queryKey: ["dashboard-kpis"],
        queryFn: async () => {
            const today = new Date()
            const year = today.getFullYear()
            const month = String(today.getMonth() + 1).padStart(2, '0')
            const day = String(today.getDate()).padStart(2, '0')
            const todayStr = `${year}-${month}-${day}`
            const todayStart = new Date(today)
            todayStart.setHours(0, 0, 0, 0)
            const tomorrowStart = new Date(todayStart)
            tomorrowStart.setDate(tomorrowStart.getDate() + 1)

            const [rooms, todayReservations, todayInvoices] = await Promise.all([
                supabase.from("rooms").select("*", { count: "exact", head: true }),
                supabase
                    .from("reservations")
                    .select("*", { count: "exact", head: true })
                    .gte("created_at", todayStart.toISOString())
                    .lt("created_at", tomorrowStart.toISOString()),
                supabase
                    .from("invoices")
                    .select("total_amount")
                    .eq("date_invoice", todayStr)
            ])

            const totalAmount = todayInvoices.data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

            return {
                totalRooms: rooms.count || 0,
                reservationsToday: todayReservations.count || 0,
                revenueToday: totalAmount,
            }
        },
    })

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[60px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const stats = [
        {
            title: "Total Rooms",
            value: data?.totalRooms,
            icon: BedDouble,
            description: "Total rooms in inventory",
            color: "text-blue-600",
        },
        {
            title: "Today's Bookings",
            value: data?.reservationsToday,
            icon: CalendarDays,
            description: "Reservations created today",
            color: "text-indigo-600",
        },
        {
            title: "Today's Revenue",
            value: `${data?.revenueToday?.toLocaleString()} MAD`,
            icon: ReceiptEuro,
            description: "Total amount from today's invoices",
            color: "text-emerald-600",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
                <Card key={stat.title} className="shadow-sm border-muted/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
