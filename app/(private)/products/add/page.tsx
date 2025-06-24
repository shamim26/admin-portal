import React from "react";
import ProductForm from "../_components/ProductForm";
import PageHeader from "@/app/components/PageHeader";
export default function AddProductPage() {
  return (
    <div>
      <PageHeader title="Add Product" />
      <div className="">
        <ProductForm />
      </div>
    </div>
  );
}
