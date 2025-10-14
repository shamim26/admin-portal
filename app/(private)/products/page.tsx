"use client";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import ProductTable from "./_components/ProductTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useEffect, useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import Link from "next/link";
import { ROUTES } from "@/lib/slugs";
import useProductStore from "@/stores/product.store";
import KpiCard from "@/app/components/card/KPICard";
import { Funnel, Package2, PackageMinusIcon, PackageX } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

      {/* Advance filter and sorting */}
      <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <div className="my-4 flex items-center justify-between">
          {/* Left Side: Add Product Button */}
          <PrimaryButton>
            <Link href={ROUTES.PRODUCTS_ADD}>Add Product</Link>
          </PrimaryButton>

          {/* Right Side: Filter and Sort Controls */}
          <div className="flex items-center gap-4">
            <Select>
              <SelectTrigger className="w-[180px] bg-white rounded">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              {/* Add SelectContent and SelectItem components here for sorting options */}
              <SelectContent className="rounded">
                <SelectItem value="price-low-high">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high-low">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="name-a-z">Name: A-Z</SelectItem>
                <SelectItem value="name-z-a">Name: Z-A</SelectItem>
                <SelectItem value="created-asc">
                  Created: Oldest First
                </SelectItem>
                <SelectItem value="created-desc">
                  Created: Newest First
                </SelectItem>
              </SelectContent>
            </Select>

            {/* This is the trigger */}
            <CollapsibleTrigger asChild>
              <PrimaryButton
                variant="outline"
                className="bg-white rounded text-muted-foreground"
              >
                <Funnel />
                <span>Filter</span>
              </PrimaryButton>
            </CollapsibleTrigger>
          </div>
        </div>

        {/* This is the section that will show/hide */}
        <CollapsibleContent className="py-4 px-4 bg-white drop-shadow rounded mb-4 animate-in slide-in-from-top-4">
          <h3 className="font-semibold mb-4">Advanced Filters</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>Category Filter...</div>
            <div>Brand Filter...</div>
            <div>Stock Status Filter...</div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <ProductTable />
      <DynamicPagination
        currentPage={1}
        totalPages={10}
        onPageChange={() => {}}
      />
    </div>
  );
}
