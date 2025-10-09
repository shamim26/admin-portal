import KpiCard from "../../components/card/KPICard";
import LowStock from "./_components/LowStock";
import OrderChart from "./_components/OrderChart";
import SalesChart from "./_components/SalesChart";
import TopCustomers from "./_components/TopCustomers";
import { Banknote, CircleDollarSign, Container } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Total Users" value={100} percentage={10} />
        <KpiCard
          title="Total Revenue"
          value={5000}
          percentage={-5}
          timeframe="This week"
          sparklineData={[
            4000, 4500, 4800, 5200, 5000, 5300, 5000, 5100, 5000, 4900, 5000,
          ]}
          icon={<Banknote />} // to use default icon
        />
        <KpiCard
          title="Total Orders"
          value={200}
          percentage={0}
          icon={<Container />}
        />
        <KpiCard
          title="Total Profit"
          value={3000}
          percentage={15}
          icon={<CircleDollarSign />}
        />
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
      <div className="mt-5">
        <OrderChart />
      </div>
    </div>
  );
}
