"use client";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import CustomerTable from "./_components/CustomerTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import CustomerForm from "./_components/CustomerForm";

export default function CustomersPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <PrimaryButton className="my-4" onClick={() => setIsModalOpen(true)}>
        Add Customer
      </PrimaryButton>
      <CustomerTable />
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
      <CustomerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
