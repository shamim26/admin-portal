"use client";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import CategoryTable from "./_components/CategoryTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import Link from "next/link";
import DynamicPagination from "@/app/components/DynamicPagination";
export default function CategoryPage() {
  const [searchValue, setSearchValue] = useState("");

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
      <PrimaryButton className="my-4">
        <Link href="/categories/create">Add Category</Link>
      </PrimaryButton>
      <CategoryTable />
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
    </div>
  );
}
