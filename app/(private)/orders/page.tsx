"use client";

import OrderTable from "./_components/OrderTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import KpiCard from "@/app/components/card/KPICard";
import { CheckCircleIcon, ClockIcon, ShoppingCartIcon, XCircleIcon } from "lucide-react";

export default function OrdersPage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Orders" />
        <SearchField
          placeholder="Search orders"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <KpiCard title="Total Orders" icon={<ShoppingCartIcon />} value={100} />
        <KpiCard title="Pending" icon={<ClockIcon />} value={50} />
        <KpiCard title="Shipped" icon={<CheckCircleIcon />} value={30} />
        <KpiCard title="Cancelled" icon={<XCircleIcon />} value={20} />
      </div>
      <OrderTable orders={sampleOrders}/>
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
    </div>
  );
}


const sampleOrders = [
  {
    _id: "1",
    orderNumber: "ORD001",
    user: {
      name: "John Doe",
    },
    grandTotal: 100,
    status: "Pending",
    paymentMethod: "Credit Card",
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    _id: "2",
    orderNumber: "ORD002",
    user: {
      name: "Jane Smith",
    },
    grandTotal: 200,
    status: "Shipped",
    paymentMethod: "PayPal",
    createdAt: "2023-01-02T00:00:00Z",
  },
  {
    _id: "3",
    orderNumber: "ORD003",
    user: {
      name: "Alice Johnson",
    },
    grandTotal: 150,
    status: "Delivered",
    paymentMethod: "Bank Transfer",
    createdAt: "2023-01-03T00:00:00Z",
  },
];
