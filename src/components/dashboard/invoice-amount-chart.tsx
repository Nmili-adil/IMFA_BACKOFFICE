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
    amount: {
        label: "Invoice Amount",
        color: "hsl(221.2 83.2% 53.3%)",
    },
} satisfies ChartConfig

interface InvoiceAmountChartProps {
    timeRange: "lastMonth" | "lastYear" | "last5Years"
}

export function InvoiceAmountChart({ timeRange }: InvoiceAmountChartProps) {
    const { data, isLoading } = useQuery({
        queryKey: ["invoice-amount-stats", timeRange],
        queryFn: async () => {
            const { data: invoices, error } = await supabase
                .from("invoices")
                .select("*")

            if (error) {
                console.error("Supabase Error:", error)
                throw new Error(error.message)
            }

            const now = new Date()
            const result: { period: string; amount: number }[] = []

            if (timeRange === "lastMonth") {

                for (let i = 3; i >= 0; i--) {
                    const start = new Date(now)
                    start.setDate(now.getDate() - (i + 1) * 7)
                    const end = new Date(now)
                    end.setDate(now.getDate() - i * 7)

                    const total = invoices?.filter(inv => {
                        const date = new Date(inv.date_invoice || inv.created_at)
                        return date >= start && date < end
                    }).reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

                    result.push({ period: `Week ${4 - i}`, amount: total })
                }
            } else if (timeRange === "lastYear") {

                for (let i = 11; i >= 0; i--) {
                    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
                    const monthLabel = d.toLocaleString('default', { month: 'short' })
                    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
                    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

                    const total = invoices?.filter(inv => {
                        const date = new Date(inv.date_invoice || inv.created_at)
                        return date >= start && date <= end
                    }).reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

                    result.push({ period: monthLabel, amount: total })
                }
            } else {

                for (let i = 4; i >= 0; i--) {
                    const year = now.getFullYear() - i
                    const start = new Date(year, 0, 1)
                    const end = new Date(year, 11, 31)

                    const total = invoices?.filter(inv => {
                        const date = new Date(inv.date_invoice || inv.created_at)
                        return date >= start && date <= end
                    }).reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0

                    result.push({ period: year.toString(), amount: total })
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
                <CardTitle className="text-lg">Revenue Overview</CardTitle>
                <CardDescription>
                    Total invoice amounts in MAD per {timeRange === "lastMonth" ? "week" : timeRange === "lastYear" ? "month" : "year"}.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart data={data || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                            tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
                            content={<ChartTooltipContent />}
                        />
                        <Bar
                            dataKey="amount"
                            fill="var(--color-amount)"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={30}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
