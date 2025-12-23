import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"

const chartConfig = {
    occupancy: {
        label: "Occupancy",
        color: "hsl(221.2 83.2% 53.3%)",
    },
} satisfies ChartConfig

export function OccupancyChart() {
    const { data, isLoading } = useQuery({
        queryKey: ["occupancy-today"],
        queryFn: async () => {
            const today = new Date().toISOString().split('T')[0]

            // total des chambres
            const { count: totalRooms } = await supabase
                .from("rooms")
                .select("*", { count: "exact", head: true })

            // les res d'aujourd;hui
            const { data: activeReservations } = await supabase
                .from("reservations")
                .select("id")
                .lte("date_debut", today)
                .gte("date_fin", today)

            const reservationIds = activeReservations?.map(r => r.id) || []

            let occupiedRoomsCount = 0
            if (reservationIds.length > 0) {
                const { data: resRooms } = await supabase
                    .from("reservations_rooms")
                    .select("room_id")
                    .in("reservation_id", reservationIds)

                occupiedRoomsCount = new Set(resRooms?.map(rr => rr.room_id)).size
            }

            const total = totalRooms || 1 
            const percentage = Math.round((occupiedRoomsCount / total) * 100)

            return {
                occupied: occupiedRoomsCount,
                total: total,
                percentage: percentage,
                chartData: [{ name: "Occupancy", value: percentage, fill: "var(--color-occupancy)" }]
            }
        },
    })

    if (isLoading) {
        return (
            <Card className="flex flex-col">
                <CardHeader className="items-center pb-0">
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <Skeleton className="mx-auto aspect-square max-h-[250px] rounded-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-lg">Real-time Occupancy</CardTitle>
                <CardDescription>Les chambres réservées aujoud'hui</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={data?.chartData}
                        startAngle={90}
                        endAngle={90 + (3.6 * (data?.percentage || 0))}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86, 74]}
                        />
                        <RadialBar dataKey="value" background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-4xl font-bold"
                                                >
                                                    {data?.percentage}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm uppercase"
                                                >
                                                    Occupied
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
            <div className="text-center pb-6 text-sm text-muted-foreground">
                {data?.occupied} of {data?.total} rooms
            </div>
        </Card>
    )
}
