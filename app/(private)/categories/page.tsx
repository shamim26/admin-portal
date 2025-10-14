"use client";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import CategoryTable from "./_components/CategoryTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import CategoryForm from "./_components/CategoryForm";
import { CustomSwitch } from "@/components/ui/switch";

export default function CategoryPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treeView, setTreeView] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeader title="Categories" />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <p>Tree View</p>
            <CustomSwitch
              checked={treeView}
              onCheckedChange={() => {
                setTreeView(!treeView);
              }}
            />
          </div>
          <SearchField
            placeholder="Search"
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
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
