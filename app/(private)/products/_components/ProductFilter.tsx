import PrimaryButton from "@/app/components/button/PrimaryButton";
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
import { ROUTES } from "@/lib/slugs";
import { Funnel } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function ProductFilter({
  isFilterOpen,
  setIsFilterOpen,
}: {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}) {
  return (
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
  );
}
