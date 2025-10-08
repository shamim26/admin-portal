import DashboardCard from "./_components/DashboardCard";
import LowStock from "./_components/LowStock";
import SalesChart from "./_components/SalesChart";
import TopCustomers from "./_components/TopCustomers";

export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <DashboardCard />
        <DashboardCard />
        <DashboardCard />
      </div>
      <div className="flex mt-5">
        <div className="w-2/3 mr-5">
          <SalesChart />
        </div>
        <TopCustomers />
      </div>
      <div className="mt-3">
        <LowStock />
      </div>
    </div>
  );
}
