import { TrendingUp, Users } from "lucide-react";

export default function DashboardCard({
  title = "Total User",
  icon = <Users size={30} fill="#4880FF" color="#4880FF" />,
  value = 100,
  percentage = 10,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  percentage: number;
}) {
  return (
    <div className="bg-white rounded p-5">
      <div className="flex items-start justify-between">
        <h1 className="text-lg text-gray-500">{title}</h1>
        <span className="block p-4 rounded bg-secondary/50">{icon}</span>
      </div>

      <p className="text-3xl font-bold -mt-5">{value}</p>

      <div className="flex items-center gap-2 mt-2">
        <TrendingUp size={20} color="#00a650" />
        <p className=" text-gray-500">
          <span className="text-success">{percentage}%</span> increase from last
          month
        </p>
      </div>
    </div>
  );
}
