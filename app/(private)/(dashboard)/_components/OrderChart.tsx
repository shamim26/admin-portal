"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function OrderChart() {
  const ordersData = [
    { name: "Jan", orders: 24 },
    { name: "Feb", orders: 30 },
    { name: "Mar", orders: 45 },
    { name: "Apr", orders: 28 },
    { name: "May", orders: 52 },
    { name: "Jun", orders: 60 },
    { name: "Jul", orders: 40 },
    { name: "Aug", orders: 48 },
    { name: "Sep", orders: 55 },
    { name: "Oct", orders: 33 },
    { name: "Nov", orders: 47 },
    { name: "Dec", orders: 62 },
  ];

  return (
    <Card className="border-none shadow-none rounded">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="h-[350px] w-full">
          <LineChart className="text-sm" data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={["auto", "auto"]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="orders"
              stroke="#22C55E"
              strokeWidth={3}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
