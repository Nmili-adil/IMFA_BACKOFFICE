import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    count: {
        label: "Active Clients",
        color: "hsl(221.2 83.2% 53.3%)", 
    },
} satisfies ChartConfig

interface ClientReservationChartProps {
    timeRange: "lastMonth" | "lastYear" | "last5Years"
}

export function ClientReservationChart({ timeRange }: ClientReservationChartProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["client-reservation-stats", timeRange],
        queryFn: async () => {
            const { data: clients, error: clientError } = await supabase
                .from("clients")
                .select("*")

            const { data: reservations, error: resError } = await supabase
                .from("reservations")
                .select("*")

            if (clientError || resError) {
                console.error("Supabase Error:", clientError || resError)
                throw new Error(clientError?.message || resError?.message)
            }

            const now = new Date()
            const result: { period: string; count: number }[] = []

            if (timeRange === "lastMonth") {
                
                for (let i = 3; i >= 0; i--) {
                    const start = new Date(now)
                    start.setDate(now.getDate() - (i + 1) * 7)
                    const end = new Date(now)
                    end.setDate(now.getDate() - i * 7)

                    const activeClients = new Set<string>()
                    clients?.forEach(c => {
                        const date = new Date(c.created_at)
                        if (date >= start && date < end) activeClients.add(c.id)
                    })
                    reservations?.forEach(r => {
                        const date = new Date(r.date_debut || r.created_at)
                        if (date >= start && date < end) activeClients.add(r.clientId)
                    })
                    result.push({ period: `Week ${4 - i}`, count: activeClients.size })
                }
            } else if (timeRange === "lastYear") {
               
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                    const monthLabel = d.toLocaleString('default', { month: 'short' })
                    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
                    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

                    const activeClients = new Set<string>()
                    clients?.forEach(c => {
                        const date = new Date(c.created_at)
                        if (date >= start && date <= end) activeClients.add(c.id)
                    })
                    reservations?.forEach(r => {
                        const date = new Date(r.date_debut || r.created_at)
                        if (date >= start && date <= end) activeClients.add(r.clientId)
                    })
                    result.push({ period: monthLabel, count: activeClients.size })
                }
            } else {
                
                for (let i = 4; i >= 0; i--) {
                    const year = now.getFullYear() - i
                    const start = new Date(year, 0, 1)
                    const end = new Date(year, 11, 31)

                    const activeClients = new Set<string>()
                    clients?.forEach(c => {
                        const date = new Date(c.created_at)
                        if (date >= start && date <= end) activeClients.add(c.id)
                    })
                    reservations?.forEach(r => {
                        const date = new Date(r.date_debut || r.created_at)
                        if (date >= start && date <= end) activeClients.add(r.clientId)
                    })
                    result.push({ period: year.toString(), count: activeClients.size })
                }
            }

            return result
        },
    })

    if (isLoading) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle><Skeleton className="h-6 w-1/4" /></CardTitle>
                    <CardDescription><Skeleton className="h-4 w-1/2" /></CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[200px] w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">Client Growth</CardTitle>
                <CardDescription>
                    Unique active clients per {timeRange === "lastMonth" ? "week" : timeRange === "lastYear" ? "month" : "year"}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis
                            dataKey="period"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            fontSize={12}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            fontSize={12}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="count"
                            fill="var(--color-count)"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={30}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
