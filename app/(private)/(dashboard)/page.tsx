import DashboardCard from "./_components/DashboardCard";
import LowStock from "./_components/LowStock";
import SalesChart from "./_components/SalesChart";

export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
      </div>
      <div className="mt-5">
        <SalesChart />
      </div>
      <div className="mt-3">
        <LowStock />
      </div>
    </div>
  );
}
