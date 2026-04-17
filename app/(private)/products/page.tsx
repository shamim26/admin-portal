"use client";
import ProductTable from "./_components/ProductTable";
import { GetProductDto } from "./product.dto";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useEffect, useState, useRef } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import useProductStore from "@/stores/product.store";
import KpiCard from "@/app/components/card/KPICard";
import {
  Package2,
  PackageMinusIcon,
  PackageX,
  Upload,
  Download,
} from "lucide-react";
import ProductFilter from "./_components/ProductFilter";
import useDebounce from "@/hooks/useDebounce";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import { ProductService } from "./product.service";

export default function ProductsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<GetProductDto>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchValue = useDebounce(searchValue);
  const {
    fetchAllProducts,
    currentPage,
    totalPages,
    fetchStats,
    stats,
    importProducts,
    
  } = useProductStore();

  useEffect(() => {
    fetchAllProducts({ ...filters, search: debouncedSearchValue, page: 1 });
    fetchStats();
  }, [fetchAllProducts, filters, debouncedSearchValue, fetchStats]);

  const handlePageChange = (page: number) => {
    fetchAllProducts({ ...filters, search: searchValue, page });
  };

  const handleExport = async () => {
    // Export logic: Fetch all products (limit 1000) and download CSV
    // For simplicity, we fetch just the current list or a larger set?
    // Let's try to fetch a larger set for export.
    try {
      const response = await ProductService.getProducts({ limit: 1000 });
      const allProducts = response.data?.payload?.products || [];

      if (allProducts.length === 0) return alert("No products to export");

      const headers = [
        "Name",
        "Description",
        "Price",
        "Category",
        "Brand",
        "Stock",
        "Variants",
      ];
      const csvRows = [headers.join(",")];

      for (const product of allProducts) {
        const row = [
          `"${product.name.replace(/"/g, '""')}"`,
          `"${product.description.replace(/"/g, '""')}"`,
          product.pricing?.basePrice || product.price || 0,
          product.category?.name || product.category || "",
          product.brand?.name || product.brand || "",
          // Stock: Sum variants stock
          product.variants?.reduce(
            (acc: number, v: any) => acc + (v.stock || 0),
            0,
          ) || 0,
          `"${product.variants?.length || 0} variants"`,
        ];
        csvRows.push(row.join(","));
      }

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products_export.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Export failed", e);
      alert("Export failed");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importProducts(file);
        alert("Import successful!");
      } catch (e) {
        alert("Import failed. See console.");
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Products" />
        <div className="flex items-center gap-3">
          <SearchField
            placeholder="Search products"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />

          <PrimaryButton
            onClick={handleImportClick}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload size={16} /> Import
          </PrimaryButton>

          <PrimaryButton
            onClick={handleExport}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download size={16} /> Export
          </PrimaryButton>
        </div>
      </div>
      {/* KPI Cards */}
      <div className="flex justify-between gap-5 mt-5">
        <KpiCard
          title="Total Products"
          icon={<Package2 />}
          value={stats.totalProducts}
        />
        <KpiCard
          title="Low Stock"
          icon={<PackageMinusIcon />}
          value={stats.lowStock}
        />
        <KpiCard
          title="Out of Stock"
          icon={<PackageX />}
          value={stats.outOfStock}
        />
      </div>

      <ProductFilter
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        filters={filters}
        onFilterChange={setFilters}
      />

      <ProductTable />
      <DynamicPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
