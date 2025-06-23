"use client";

import OrderTable from "./_components/OrderTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";

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
      <OrderTable />
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
    </div>
  );
}
