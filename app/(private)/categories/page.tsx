"use client";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import CategoryTable from "./_components/CategoryTable";
import TreeView from "./_components/TreeView";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import CategoryForm from "./_components/CategoryForm";
import { CustomSwitch } from "@/components/ui/switch";
import { useCategoryStore } from "@/stores/category.store";
import { useEffect } from "react";

export default function CategoryPage() {
  const [searchValue, setSearchValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [treeView, setTreeView] = useState(false);
  const { fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

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

      {treeView ? <TreeView /> : <CategoryTable />}

      {!treeView && (
        <DynamicPagination
          currentPage={1}
          totalPages={10}
          onPageChange={() => {}}
        />
      )}
      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
