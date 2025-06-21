"use client";

import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SalesChart() {
  return (
    <Card className="border-none shadow-none rounded">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[350px] w-full">
          <LineChart className="text-sm" data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#4880FF"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

const salesData = [
  {
    name: "Jan",
    total: 1000,
  },
  {
    name: "Feb",
    total: 1500,
  },
  {
    name: "Mar",
    total: 2000,
  },
  {
    name: "Apr",
    total: 1500,
  },
  {
    name: "May",
    total: 3000,
  },
  {
    name: "Jun",
    total: 3500,
  },
  {
    name: "Jul",
    total: 2000,
  },
  {
    name: "Aug",
    total: 2500,
  },
  {
    name: "Sep",
    total: 3000,
  },
  {
    name: "Oct",
    total: 1500,
  },
];
