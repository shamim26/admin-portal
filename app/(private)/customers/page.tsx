"use client";

import CustomerTable from "./_components/CustomerTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";

export default function CustomersPage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Customers" />
        <SearchField
          placeholder="Search customers"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>

      <CustomerTable />
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
    </div>
  );
}
