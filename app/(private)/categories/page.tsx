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
import useDebounce from "@/hooks/useDebounce";
import useQuerySync from "@/hooks/useQuerySync";

import { CategoryDTO } from "./category.dto";

export default function CategoryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<CategoryDTO | null>(null);
  const [treeView, setTreeView] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  const {
    setSearch,
    currentPage,
    totalPages,
    setPage,
  } = useCategoryStore();

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  useQuerySync({
    search: debouncedSearch,
    page: currentPage,
  });

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

      {treeView ? (
        <TreeView />
      ) : (
        <CategoryTable
          onEdit={(cat) => {
            setCurrentCategory(cat);
            setIsModalOpen(true);
          }}
        />
      )}

      {!treeView && (
        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
      <CategoryForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentCategory(null);
        }}
        initialData={currentCategory}
      />
    </div>
  );
}
