"use client";

import { Button } from "@/components/ui/button";
import { EditIcon } from "lucide-react";
import React from "react";
import ProductGallery from "../_components/ProductGallery";

import Link from "next/link";
import useProductStore from "@/stores/product.store";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROUTES } from "@/lib/slugs";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { fetchProductById, currentProduct, loading } = useProductStore();

  useEffect(() => {
    if (id) fetchProductById(id as string);
  }, [id, fetchProductById]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!currentProduct)
    return <div className="p-10 text-center">Product not found</div>;

  const product = {
    name: currentProduct.name,
    price: `$${currentProduct.pricing?.basePrice || currentProduct.price || 0}`,
    originalPrice: currentProduct.pricing?.compareAtPrice
      ? `$${currentProduct.pricing.compareAtPrice}`
      : null,
    description: currentProduct.description,
    features: (currentProduct.specifications || []).map(
      (s: any) => `${s.key}: ${s.value}`,
    ),
    images:
      currentProduct.images && currentProduct.images.length > 0
        ? currentProduct.images
        : ["https://placehold.co/800x800/e2e8f0/1e293b?text=No+Image"],
    imagePlaceholder:
      "https://placehold.co/800x800/e2e8f0/1e293b?text=No+Image",
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center font-sans p-4">
      <div className="w-full mx-auto">
        <div className="flex items-start gap-10 mx-auto md:flex-row flex-col">
          <ProductGallery product={product} />
          {/* Right Column: Product Details */}
          <div className="w-[700px] flex flex-col gap-6">
            <Badge className="bg-blue-600 text-white border-blue-600 w-fit">
              New Arrival
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-blue-400">
                {product.price}
              </span>
              <span className="text-4xl font-bold text-blue-400">
                {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xl  line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>

            <p className=" leading-relaxed">{product.description}</p>

            <div>
              <h3 className="text-lg font-semibold mb-3">Key Features:</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <Link href={`${ROUTES.PRODUCTS_EDIT}/${currentProduct.id}`}>
                <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 h-12 px-6 text-base font-semibold gap-2">
                  <EditIcon className="w-5 h-5" />
                  Edit Product
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Badge = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`inline-flex items-center rounded-full border border-gray-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:border-gray-800 dark:focus:ring-gray-300 ${className}`}
  >
    {children}
  </div>
);
