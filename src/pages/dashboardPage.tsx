import { useState } from "react";
import { ClientReservationChart } from "@/components/dashboard/client-reservation-chart";
import { ReservationStatsChart } from "@/components/dashboard/reservation-stats-chart";
import { InvoiceAmountChart } from "@/components/dashboard/invoice-amount-chart";
import { OccupancyChart } from "@/components/dashboard/occupancy-chart";
import { KPIStats } from "@/components/dashboard/kpi-stats";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const [timeRange, setTimeRange] = useState<"lastMonth" | "lastYear" | "last5Years">("lastYear");

  return (

    <div className="p-6 space-y-8">
      <h1 className="text-xl font-bold tracking-tight">General KPIs</h1>
      <KPIStats />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-xl font-bold tracking-tight">Charts overview</h1>
        </div>

        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border">
          <Button
            variant={timeRange === "lastMonth" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("lastMonth")}
            className={timeRange === "lastMonth" ? "shadow-sm" : ""}
          >
            Last Month
          </Button>
          <Button
            variant={timeRange === "lastYear" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("lastYear")}
            className={timeRange === "lastYear" ? "shadow-sm" : ""}
          >
            Last Year
          </Button>
          <Button
            variant={timeRange === "last5Years" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setTimeRange("last5Years")}
            className={timeRange === "last5Years" ? "shadow-sm" : ""}
          >
            Last 5 Years
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-2xl font-bold" id="charts">
        <OccupancyChart />
        <ClientReservationChart timeRange={timeRange} />
        <ReservationStatsChart timeRange={timeRange} />
        <InvoiceAmountChart timeRange={timeRange} />
      </div>
    </div>
  );
};

export default DashboardPage;
