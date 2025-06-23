"use client";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import ProductTable from "./_components/ProductTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import Link from "next/link";
import { ROUTES } from "@/lib/slugs";

export default function ProductsPage() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Products" />
        <SearchField
          placeholder="Search products"
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
      <PrimaryButton className="my-4">
        <Link href={ROUTES.PRODUCTS_ADD}>Add Product</Link>
      </PrimaryButton>
      <ProductTable />
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
    </div>
  );
}
