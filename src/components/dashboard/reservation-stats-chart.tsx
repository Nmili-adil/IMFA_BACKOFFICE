import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { supabase, type Reservation } from "@/lib/supabase"
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
        label: "Total Reservations",
        color: "hsl(199 89% 48%)", 
    },
} satisfies ChartConfig

interface ReservationStatsChartProps {
    timeRange: "lastMonth" | "lastYear" | "last5Years"
}

export function ReservationStatsChart({ timeRange }: ReservationStatsChartProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["reservation-stats", timeRange],
        queryFn: async () => {
            const { data: reservations, error: resError } = await supabase
                .from("reservations")
                .select("*")

            if (resError) {
                console.error("Supabase Error:", resError)
                throw new Error(resError.message)
            }

            const now = new Date()
            const result: { period: string; count: number }[] = []

            if (timeRange === "lastMonth") {
                // par semaines
                for (let i = 3; i >= 0; i--) {
                    const start = new Date(now)
                    start.setDate(now.getDate() - (i + 1) * 7)
                    const end = new Date(now)
                    end.setDate(now.getDate() - i * 7)

                    const count = reservations?.filter(r => {
                        const date = new Date(r.date_debut || r.created_at)
                        return date >= start && date < end
                    }).length || 0

                    result.push({ period: `Week ${4 - i}`, count })
                }
            } else if (timeRange === "lastYear") {
                // par mois
                for (let i = 11; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                    const monthLabel = d.toLocaleString('default', { month: 'short' })
                    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
                    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

                    const count = reservations?.filter(r => {
                        const date = new Date(r.date_debut || r.created_at)
                        return date >= start && date <= end
                    }).length || 0

                    result.push({ period: monthLabel, count })
                }
            } else {
                // par annees
                for (let i = 4; i >= 0; i--) {
                    const year = now.getFullYear() - i
                    const start = new Date(year, 0, 1)
                    const end = new Date(year, 11, 31)

                    const count = reservations?.filter(r => {
                        const date = new Date(r.date_debut || r.created_at)
                        return date >= start && date <= end
                    }).length || 0

                    result.push({ period: year.toString(), count })
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
                <CardTitle className="text-lg">Reservations Activity</CardTitle>
                <CardDescription>
                    Total bookings confirmed per {timeRange === "lastMonth" ? "week" : timeRange === "lastYear" ? "month" : "year"}.
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
