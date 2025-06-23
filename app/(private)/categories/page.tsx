"use client";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import CategoryTable from "./_components/CategoryTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import CategoryForm from "./_components/CategoryForm";

export default function CategoryPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Categories" />
        <SearchField
          placeholder="Search"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
      <PrimaryButton className="my-4" onClick={() => setIsModalOpen(true)}>
        Add Category
      </PrimaryButton>
      <CategoryTable />
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
