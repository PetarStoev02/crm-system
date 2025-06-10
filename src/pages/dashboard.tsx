import { ChartAreaInteractive } from "@/features/chart-area-interactive";
import { SectionCards } from "@/features/section-cards";


export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6 w-full">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <ChartAreaInteractive />
      <SectionCards />
    </div>
  );
}
