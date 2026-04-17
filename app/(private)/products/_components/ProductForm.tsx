"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import CustomInput from "@/app/components/input-fields/CustomInput";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import SearchDropdown from "@/app/components/SearchDropdown";
import { Input } from "@/components/ui/input";
import { TextEditor } from "./TextEditor";
import ProductVariant from "./ProductVariant";
import { Textarea } from "@/components/ui/textarea";
import useProductStore from "@/stores/product.store";
import { Product, CategoryReference, BrandReference, ProductVariantOption } from "../product.dto";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/slugs";
import { useCategoryStore } from "@/stores/category.store";
import { useBrandStore } from "@/stores/brand.store";

// --- Zod Schema ---
const variantSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  options: z
    .array(
      z.object({
        _id: z.string().optional(),
        option_name: z.string().min(1, "Option name is required"),
        option_value: z.string().min(1, "Option value is required"),
      }),
    )
    .optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().optional(),
  brand: z.string().optional(),

  // For media, we handle file uploads separately from existing images
  media: z.any().optional(),
  // We don't strictly validate 'media' here because we manage it manually.
  // Or we can use a refinement if needed.

  images: z.array(z.string()).optional(), // Existing images

  pricing: z.object({
    basePrice: z.coerce.number().min(0),
    compareAtPrice: z.coerce.number().optional(),
  }),

  variants: z
    .array(variantSchema)
    .min(1, "At least one product variant is required."),

  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Spec key is required"),
        value: z.string().min(1, "Spec value is required"),
      }),
    )
    .optional(),

  seo: z
    .object({
      title: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),

  isFeatured: z.boolean().default(false).optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product | null;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { createProduct, updateProduct, loading } = useProductStore();

  // State for new file uploads
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newFilePreviews, setNewFilePreviews] = useState<string[]>([]);

  const [hasVariants, setHasVariants] = useState<boolean>(false);

  const { allCategories, fetchAllCategories, loading: categoryLoading } = useCategoryStore();
  const { allBrands, fetchAllBrands, loading: brandLoading } = useBrandStore();

  useEffect(() => {
    fetchAllCategories();
    fetchAllBrands();
  }, [fetchAllCategories, fetchAllBrands]);

  const categoryItems = allCategories.map((c: CategoryReference) => ({
    label: c.name,
    value: (c._id) as string,
    id: (c._id) as string,
  }));

  const brandItems = allBrands.map((b: BrandReference) => ({
    label: b.name,
    value: (b._id) as string,
    id: (b._id) as string,
  }));

  // default values
  const defaultValues: Partial<ProductFormValues> = {
    name: "",
    description: "",
    category: "",
    brand: "",
    media: [],
    images: [],
    pricing: { basePrice: 0, compareAtPrice: 0 },
    variants: [
      {
        sku: "",
        price: 0,
        stock: 1,
        options: [],
      },
    ],
    specifications: [],
    isFeatured: false,
  };

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues,
  });

  // Load initial data
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        description: initialData.description,
        category: typeof initialData.category === "object" ? ((initialData.category as CategoryReference)?._id) : initialData.category as string,
        brand: typeof initialData.brand === "object" ? ((initialData.brand as BrandReference)?._id) : initialData.brand as string,
        pricing: {
          basePrice: initialData.pricing?.basePrice || 0,
          compareAtPrice: initialData.pricing?.compareAtPrice || 0,
        },
        variants:
          initialData.variants?.map((v) => ({
            ...v,
            options:
              v.options?.map((o: ProductVariantOption) => ({
                _id: o._id,
                option_name: o.name,
                option_value: o.values[0] || "",
              })) || [],
          })) || [],
        specifications: initialData.specifications || [],
        images: initialData.images || [],
        isFeatured: initialData.isFeatured || false,
      });

      setHasVariants(initialData.variants && initialData.variants.length > 0);
    }
  }, [initialData, form]);

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  // Clean up object URLs
  useEffect(() => {
    return () => {
      newFilePreviews.forEach(URL.revokeObjectURL);
    };
  }, [newFilePreviews]);

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const formData = new FormData();

      // Append simple fields
      formData.append("name", data.name);
      formData.append("description", data.description);
      if (data.category) formData.append("category", data.category);
      if (data.brand) formData.append("brand", data.brand);
      if (data.isFeatured !== undefined)
        formData.append("isFeatured", String(data.isFeatured));

      // Append complex fields as JSON
      formData.append("pricing", JSON.stringify(data.pricing));

      const mappedVariants = data.variants.map((v) => ({
        ...v,
        options:
          v.options?.map((o) => ({
            ...(o._id ? { _id: o._id } : {}),
            name: o.option_name,
            values: [o.option_value],
          })) || [],
      }));
      formData.append("variants", JSON.stringify(mappedVariants));
      if (data.specifications)
        formData.append("specifications", JSON.stringify(data.specifications));

      // Append existing images (as JSON or array)
      if (data.images && data.images.length > 0) {
        formData.append("images", JSON.stringify(data.images));
      }

      // Append new files
      newFiles.forEach((file) => {
        formData.append("images", file);
      });

      if (initialData?._id) {
        await updateProduct(initialData._id, formData as unknown as Partial<Product>);
      } else {
        await createProduct(formData as unknown as Partial<Product>);
      }

      router.push(ROUTES.PRODUCTS);
    } catch (error) {
      console.error("Submission failed", error);
    }
  };

  const handleNewFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFilesList: File[] = [];
    const newPreviewsList: string[] = [];

    const maxImages = 5;
    // Count existing + already added new
    const currentCount =
      (form.getValues("images")?.length || 0) + newFiles.length;

    for (let i = 0; i < Math.min(files.length, maxImages - currentCount); i++) {
      const file = files[i];
      if (file && file.type.startsWith("image/")) {
        newFilesList.push(file);
        newPreviewsList.push(URL.createObjectURL(file));
      }
    }

    setNewFiles((prev) => [...prev, ...newFilesList]);
    setNewFilePreviews((prev) => [...prev, ...newPreviewsList]);
  };

  const removeExistingImage = (index: number) => {
    const currentImages = form.getValues("images") || [];
    const newImages = [...currentImages];
    newImages.splice(index, 1);
    form.setValue("images", newImages);
  };

  const removeNewFile = (index: number) => {
    const currentFiles = [...newFiles];
    const currentPreviews = [...newFilePreviews];

    URL.revokeObjectURL(currentPreviews[index]);

    currentFiles.splice(index, 1);
    currentPreviews.splice(index, 1);

    setNewFiles(currentFiles);
    setNewFilePreviews(currentPreviews);
  };

  const existingImages = form.watch("images") || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* --- Left Column: Core Details & Variants --- */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Details Card */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Core Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <CustomInput
                      type="text"
                      label="Product name"
                      field={field}
                      className="col-span-2"
                      placeholder="e.g., AuraBook Pro 15-inch"
                    />
                  )}
                />
                <FormField
                  name="pricing.basePrice"
                  control={form.control}
                  render={({ field }) => (
                    <CustomInput
                      label="Base Price ($)"
                      field={field}
                      type="number"
                    />
                  )}
                />
                <FormField
                  name="pricing.compareAtPrice"
                  control={form.control}
                  render={({ field }) => (
                    <CustomInput
                      label="Compare At Price ($)"
                      field={field}
                      type="number"
                    />
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <TextEditor
                        value={field.value}
                        onChange={field.onChange}
                        label="Description"
                      />
                    )}
                  />
                </div>
              </div>
            </div>

            {/* --- Variants Card --- */}
            <div className="bg-white p-6 rounded shadow space-y-6">
              <h3 className="text-lg font-semibold">Variants</h3>

              <p className="inline float-start font-medium text-gray-500 text-sm">
                Does this product have variants?
              </p>

              <label className=" inline-flex items-center space-x-1">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => setHasVariants(e.target.checked)}
                  className="h-4 w-4 rounded text-primary ml-3"
                />
                <span className="text-sm font-medium text-gray-500">Yes</span>
              </label>

              {hasVariants && <ProductVariant />}
            </div>

            {/* --- Specifications Card --- */}
            <div className="bg-white p-6 rounded shadow relative">
              <div className={specFields.length === 0 ? "mb-0" : "mb-4"}>
                <h3 className="text-lg font-semibold">Specifications</h3>
              </div>
              <div className="space-y-4">
                {specFields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start relative"
                  >
                    <FormField
                      name={`specifications.${index}.key`}
                      control={form.control}
                      render={({ field }) => (
                        <CustomInput
                          type="text"
                          label="Name"
                          field={field}
                          placeholder="e.g., Processor"
                        />
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <FormField
                        name={`specifications.${index}.value`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Value</FormLabel>
                            <Textarea
                              {...field}
                              placeholder="e.g., AuraChip M3 Max"
                              className="min-h-4"
                            />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end h-full mt-5">
                        <PrimaryButton
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeSpec(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </PrimaryButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={`${
                  specFields.length === 0
                    ? "absolute right-5 top-1/4"
                    : "flex justify-end mt-4"
                }`}
              >
                <PrimaryButton
                  type="button"
                  onClick={() => appendSpec({ key: "", value: "" })}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Spec
                </PrimaryButton>
              </div>
            </div>
          </div>

          {/* --- Right Column: Organization & Media --- */}
          <div className="space-y-6">
            {/* Organization Card */}
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-lg font-semibold mb-4">Organization</h3>
              <div className="space-y-6">
                <FormField
                  name="category"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <SearchDropdown
                        items={categoryItems}
                        placeholder="Select category"
                        onSelect={field.onChange}
                        value={field.value}
                        emptyMessage="No categories found"
                        loading={categoryLoading}
                        onSearch={() => {}}
                      />
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  name="brand"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <SearchDropdown
                        items={brandItems}
                        placeholder="Select brand"
                        onSelect={field.onChange}
                        value={field.value}
                        emptyMessage="No brands found"
                        loading={brandLoading}
                        onSearch={() => {}}
                      />
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  name="isFeatured"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded text-primary"
                      />
                      <FormLabel>Featured Product</FormLabel>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Media Card */}
            <div className="bg-white p-6 rounded shadow">
              <FormLabel>Product Media</FormLabel>
              <div className="mt-2 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((src, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <Image
                        src={src}
                        alt={`Existing ${index}`}
                        width={100}
                        height={100}
                        className="object-cover rounded-md w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}

                  {/* New Files */}
                  {newFilePreviews.map((src, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <Image
                        src={src}
                        alt={`New ${index}`}
                        width={100}
                        height={100}
                        className="object-cover rounded-md w-full h-full border-2 border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewFile(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {existingImages.length + newFiles.length < 5 && (
                  <label
                    htmlFor="image-upload"
                    className="border bg-gray-50 border-dashed border-gray-300 p-4 w-full flex flex-col items-center justify-center hover:border-primary cursor-pointer rounded-md"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Click to upload</p>
                    <p className="text-xs text-gray-400">
                      ({existingImages.length + newFiles.length}/5 images)
                    </p>
                  </label>
                )}
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleNewFileUpload(e.target.files)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <PrimaryButton
            type="submit"
            disabled={loading || form.formState.isSubmitting}
          >
            {loading || form.formState.isSubmitting
              ? "Saving..."
              : "Save Product"}
          </PrimaryButton>
        </div>
      </form>
    </Form>
  );
}
