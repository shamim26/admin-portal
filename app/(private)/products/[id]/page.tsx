"use client";

import { Button } from "@/components/ui/button";
import { 
  EditIcon, 
  ArrowLeft, 
  Tag, 
  Layers, 
  Package, 
  ShieldCheck, 
  List,
  Box
} from "lucide-react";
import React, { useEffect } from "react";
import ProductGallery from "../_components/ProductGallery";
import Link from "next/link";
import useProductStore from "@/stores/product.store";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/slugs";
import { CategoryReference, BrandReference, ProductVariant } from "../product.dto";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchProductById, currentProduct, loading } = useProductStore();

  useEffect(() => {
    if (id) fetchProductById(id as string);
  }, [id, fetchProductById]);

  if (loading) return (
    <div className="flex h-[80vh] items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (!currentProduct) return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
      <h2 className="text-2xl font-bold text-slate-800">Product not found</h2>
      <p className="text-slate-500">The product you are looking for does not exist or was deleted.</p>
      <Button onClick={() => router.push(ROUTES.PRODUCTS)} variant="outline" className="mt-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
      </Button>
    </div>
  );

  const categoryName = typeof currentProduct.category === "object" ? (currentProduct.category as CategoryReference)?.name : "Uncategorized";
  const brandName = typeof currentProduct.brand === "object" ? (currentProduct.brand as BrandReference)?.name : "No Brand";
  const totalStock = currentProduct.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || 0;

  // Adapt for ProductGallery Component
  const galleryProduct = {
    name: currentProduct.name,
    price: `$${currentProduct.pricing?.basePrice || 0}`,
    originalPrice: currentProduct.pricing?.compareAtPrice ? `$${currentProduct.pricing.compareAtPrice}` : "",
    description: currentProduct.description,
    features: (currentProduct.specifications || []).map((s) => `${s.key}: ${s.value}`),
    images: currentProduct.images?.length > 0 ? currentProduct.images : ["https://placehold.co/800x800/e2e8f0/1e293b?text=No+Image"],
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-12 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <Button variant="ghost" onClick={() => router.push(ROUTES.PRODUCTS)} className="text-slate-600 hover:text-slate-900 -ml-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
          </Button>
          <div className="flex gap-3">
            <Link href={`${ROUTES.PRODUCTS_EDIT}/${currentProduct._id}`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold tracking-wide">
                <EditIcon className="mr-2 h-4 w-4" /> Edit Product
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden mt-4">
          <div className="flex flex-col lg:flex-row p-6 lg:p-10 xl:p-12 gap-12 xl:gap-16">
            
            {/* Left: Gallery */}
            <div className="w-full lg:w-5/12 xl:w-1/2">
              <ProductGallery product={galleryProduct} />
            </div>

            {/* Right: Details */}
            <div className="w-full lg:w-7/12 xl:w-1/2 flex flex-col gap-8">
              
              {/* Title & Badges */}
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-3">
                  {currentProduct.isFeatured && (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 px-3 py-1.5 shadow-sm">Featured</Badge>
                  )}
                  <Badge className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1.5 flex items-center gap-1.5">
                     <Layers className="w-3.5 h-3.5" /> {categoryName}
                  </Badge>
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 px-3 py-1.5 flex items-center gap-1.5">
                     <Tag className="w-3.5 h-3.5" /> {brandName}
                  </Badge>
                </div>
                
                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {currentProduct.name}
                </h1>

                <div className="flex items-baseline gap-4 mt-2">
                  <span className="text-4xl font-black text-slate-900">
                    ${currentProduct.pricing?.basePrice?.toFixed(2) || "0.00"}
                  </span>
                  {(currentProduct.pricing?.compareAtPrice || 0) > 0 && (
                     <span className="text-xl text-slate-400 line-through font-semibold decoration-slate-300">
                       ${currentProduct.pricing.compareAtPrice.toFixed(2)}
                     </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div 
                className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-lg prose-p:my-2 prose-headings:my-3"
                dangerouslySetInnerHTML={{ __html: currentProduct.description }}
              />

              {/* Status & Warranty */}
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 py-6 border-y border-slate-100">
                <div className="flex items-center gap-4 pr-6 sm:border-r border-slate-100">
                  <div className={`p-3 rounded-xl ${totalStock > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Total Stock</p>
                    <p className="font-bold text-slate-900 text-lg">{totalStock} Units <span className="text-sm font-medium text-slate-500 ml-1">({totalStock > 0 ? "In Stock" : "Out of Stock"})</span></p>
                  </div>
                </div>
                {currentProduct.warranty && (
                  <div className="flex items-center gap-4 pl-2">
                    <div className="p-3 rounded-xl bg-blue-100 text-blue-700">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Warranty</p>
                      <p className="font-bold text-slate-900 text-lg">{currentProduct.warranty}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Variants Breakdown */}
              {currentProduct.variants && currentProduct.variants.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Box className="w-5 h-5 text-slate-500" />
                    Inventory Variants
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {currentProduct.variants.map((v: ProductVariant, idx: number) => (
                      <div key={v._id || idx} className="flex justify-between items-center p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm">
                        <div className="space-y-1.5">
                          <p className="font-bold text-slate-900 text-sm">
                            {v.options?.map(o => o.values[0]).join(" • ") || "Default Option"}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            SKU: <span className="text-slate-700">{v.sku}</span>
                          </p>
                        </div>
                        <div className="text-right space-y-1.5">
                          <p className="font-black text-blue-600">${v.price.toFixed(2)}</p>
                          <p className={`text-xs font-bold ${v.stock > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                            {v.stock} in stock
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {currentProduct.specifications && currentProduct.specifications.length > 0 && (
                <div className="space-y-4 pt-6">
                   <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                     <List className="w-5 h-5 text-slate-500" />
                     Technical Specifications
                   </h3>
                   <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm">
                     <table className="w-full text-sm text-left">
                       <tbody className="divide-y divide-slate-200/60">
                         {currentProduct.specifications.map((spec, index) => (
                           <tr key={index} className="hover:bg-slate-50/80 transition-colors">
                             <th className="px-6 py-4 font-semibold text-slate-700 w-1/3 bg-slate-50/50">
                               {spec.key}
                             </th>
                             <td className="px-6 py-4 text-slate-600 font-medium">
                               {spec.value}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center rounded-full border text-xs font-bold transition-colors ${className}`}>
    {children}
  </span>
);
