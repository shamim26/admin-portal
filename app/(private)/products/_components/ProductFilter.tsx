import PrimaryButton from "@/app/components/button/PrimaryButton";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/lib/slugs";
import { Funnel } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useCategoryStore } from "@/stores/category.store";
import { GetProductDto } from "../product.dto";

interface ProductFilterProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  filters: GetProductDto;
  onFilterChange: (filters: GetProductDto) => void;
}

export default function ProductFilter({
  isFilterOpen,
  setIsFilterOpen,
  filters,
  onFilterChange,
}: ProductFilterProps) {
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, sort: value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({
      ...filters,
      category: value === "all" ? undefined : value,
    });
  };

  const handleStockStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      stockStatus: value === "all" ? undefined : value,
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof GetProductDto
  ) => {
    const value = e.target.value;
    onFilterChange({
      ...filters,
      [field]: value === "" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <div className="my-4 flex items-center justify-between">
        {/* Left Side: Add Product Button */}
        <PrimaryButton>
          <Link href={ROUTES.PRODUCTS_ADD}>Add Product</Link>
        </PrimaryButton>

        {/* Right Side: Filter and Sort Controls */}
        <div className="flex items-center gap-4">
          <Select value={filters.sort || ""} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] bg-white rounded">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="rounded">
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
              <SelectItem value="name-a-z">Name: A-Z</SelectItem>
              <SelectItem value="name-z-a">Name: Z-A</SelectItem>
              <SelectItem value="created-asc">Created: Oldest First</SelectItem>
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
              <Funnel className="mr-2 h-4 w-4" />
              <span>Filter</span>
            </PrimaryButton>
          </CollapsibleTrigger>
        </div>
      </div>

      {/* This is the section that will show/hide */}
      <CollapsibleContent className="py-4 px-4 bg-white drop-shadow rounded mb-4 animate-in slide-in-from-top-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Advanced Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Clear All
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Brand */}
          <div className="space-y-2">
            <Label>Brand</Label>
            <Input
              placeholder="Filter by Brand"
              value={filters.brand || ""}
              onChange={(e) => handleInputChange(e, "brand")}
              className="bg-white"
            />
          </div>
          {/* Stock Status */}
          <div className="space-y-2">
            <Label>Stock Status</Label>
            <Select
              value={filters.stockStatus || "all"}
              onValueChange={handleStockStatusChange}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Color */}
          <div className="space-y-2">
            <Label>Color</Label>
            <Input
              placeholder="e.g. Red, Blue"
              value={filters.color || ""}
              onChange={(e) => handleInputChange(e, "color")}
              className="bg-white"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
