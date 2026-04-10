"use client";

import React, { useEffect, useState } from "react";
import ProductForm from "../../_components/ProductForm";
import PageHeader from "@/app/components/PageHeader";
import useProductStore from "@/stores/product.store";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const { fetchProductById, currentProduct, loading } = useProductStore();

  useEffect(() => {
    if (id) {
      fetchProductById(id as string);
    }
  }, [id, fetchProductById]);

  if (loading) {
    return <div>Loading product...</div>;
  }

  if (!currentProduct) {
    return <div>Product not found or not loaded.</div>;
  }

  return (
    <div>
      <PageHeader title="Edit Product" />
      <div className="">
        <ProductForm initialData={currentProduct} />
      </div>
    </div>
  );
}
