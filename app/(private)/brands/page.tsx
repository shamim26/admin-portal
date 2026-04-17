"use client";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import BrandTable from "./_components/BrandTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState, useEffect } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import BrandForm from "./_components/BrandForm";
import { useBrandStore } from "@/stores/brand.store";
import { BrandDTO } from "./brand.dto";

export default function BrandsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<BrandDTO | null>(null);

  const {
    fetchBrands,
    search,
    setSearch,
    currentPage,
    totalPages,
    setPage,
  } = useBrandStore();

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Brands" />
        <div className="flex items-center gap-2">
          <SearchField
            placeholder="Search brands"
            searchValue={search}
            setSearchValue={setSearch}
          />
        </div>
      </div>
      
      <PrimaryButton className="my-4" onClick={() => setIsModalOpen(true)}>
        Add Brand
      </PrimaryButton>

      <BrandTable
        onEdit={(brand) => {
          setCurrentBrand(brand);
          setIsModalOpen(true);
        }}
      />

      <div className="mt-4">
        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      <BrandForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentBrand(null);
        }}
        initialData={currentBrand}
      />
    </div>
  );
}
