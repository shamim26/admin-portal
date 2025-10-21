"use client";
import ProductTable from "./_components/ProductTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useEffect, useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import useProductStore from "@/stores/product.store";
import KpiCard from "@/app/components/card/KPICard";
import { Package2, PackageMinusIcon, PackageX } from "lucide-react";
import ProductFilter from "./_components/ProductFilter";

export default function ProductsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

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
      {/* KPI Cards */}
      <div className="flex justify-between gap-5 mt-5">
        <KpiCard title="Total Products" icon={<Package2 />} />
        <KpiCard title="Low Stock" icon={<PackageMinusIcon />} />
        <KpiCard title="Out of Stock" icon={<PackageX />} />
      </div>

      <ProductFilter
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
      />

      <ProductTable />
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
    </div>
  );
}
