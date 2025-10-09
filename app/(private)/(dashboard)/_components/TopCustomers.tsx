import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import React from "react";

export default function TopCustomers() {
  return (
    <Card className="rounded border-none shadow-none p-5 w-1/3">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Top Customers
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Customers with the highest spend
          </p>
        </div>
        <Select>
          <SelectTrigger className="w-[180px] h-8 text-sm rounded">
            This Month
          </SelectTrigger>
          <SelectContent className="rounded">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="this-month">This Month</SelectItem>
            <SelectItem value="last-month">Last Month</SelectItem>
            <SelectItem value="last-3-months">Last 3 Months</SelectItem>
            <SelectItem value="year-to-date">Year to Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Customers list */}
      <div className="max-h-80 overflow-y-auto hide-scrollbar">
        <ul>
          {[
            { id: 1, name: "Ava Morgan", amount: "$28,400" },
            { id: 2, name: "Liam Carter", amount: "$19,750" },
            { id: 3, name: "Sophia Patel", amount: "$12,320" },
            { id: 4, name: "Noah Kim", amount: "$9,110" },
            { id: 5, name: "Isabella Garcia", amount: "$7,890" },
            { id: 6, name: "Mason Lee", amount: "$6,450" },
            { id: 7, name: "Mia Rodriguez", amount: "$5,230" },
            { id: 8, name: "Ethan Brown", amount: "$4,980" },
            { id: 9, name: "Olivia Wilson", amount: "$4,560" },
            { id: 10, name: "James Davis", amount: "$4,120" },
          ].map((customer) => (
            <li
              key={customer.id}
              className="relative flex items-center justify-between bg-white/40 dark:bg-gray-800/40  p-3 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`https://i.pravatar.cc/150?u=${customer.id}`}
                    alt={customer.name}
                  />
                  <AvatarFallback>
                    {customer.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {customer.name}
                  </div>
                </div>
              </div>

              <div className="w-40 flex flex-col items-end">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {customer.amount}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
