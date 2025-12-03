"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFieldArray, FieldErrors } from "react-hook-form";
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

// --- 1. Zod Schema updated to match the Mongoose model ---
const variantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  options: z
    .array(
      z.object({
        option_name: z.string().min(1, "Option name is required"),
        option_value: z.string().min(1, "Option value is required"),
      })
    )
    .optional(),
});

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string(),
  brand: z.string().optional(),

  media: z
    .array(z.object({ file: z.instanceof(File) }))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed"),

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
      })
    )
    .optional(),

  seo: z
    .object({
      title: z.string().optional(),
      metaDescription: z.string().optional(),
    })
    .optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductForm() {
  // State for managing UI previews of images
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [hasVariants, setHasVariants] = useState<boolean>(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      category: "",
      brand: "",
      media: [],
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
    },
  });

  // --- 2. useFieldArray for dynamic fields ---
  const {
    fields: mediaFields,
    append: appendMedia,
    remove: removeMedia,
  } = useFieldArray({
    control: form.control,
    name: "media",
  });

  const {
    fields: specFields,
    append: appendSpec,
    remove: removeSpec,
  } = useFieldArray({
    control: form.control,
    name: "specifications",
  });

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      mediaPreviews.forEach(URL.revokeObjectURL);
    };
  }, [mediaPreviews]);

  const onSubmit = (data: ProductFormValues) => {
    // Here you would typically create FormData to send files to the server
    console.log("Form Data Submitted:", data);
    // const formData = new FormData();
    // // Append other fields
    // formData.append('name', data.name);
    // // ... etc
    // data.media.forEach((mediaItem, index) => {
    //   formData.append(`media[${index}]`, mediaItem.file);
    // });
    // // Then send formData to your API
  };

  const onError = (errors: FieldErrors<ProductFormValues>) => {
    console.log("Form Errors:", errors);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const currentCount = mediaFields.length;
    const maxImages = 5;

    for (let i = 0; i < Math.min(files.length, maxImages - currentCount); i++) {
      const file = files[i];
      if (file && file.type.startsWith("image/")) {
        appendMedia({ file });
        setMediaPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    removeMedia(index);
    const newPreviews = [...mediaPreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up the specific URL
    newPreviews.splice(index, 1);
    setMediaPreviews(newPreviews);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
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

            {/* --- Variants Card (Now using the sub-component) --- */}
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
                        items={[]}
                        placeholder="Select category"
                        onSelect={field.onChange}
                        emptyMessage="No categories found"
                        loading={false}
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
                        items={[]}
                        placeholder="Select brand"
                        onSelect={field.onChange}
                        emptyMessage="No brands found"
                        loading={false}
                        onSearch={() => {}}
                      />
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Media Card */}
            <div className="bg-white p-6 rounded shadow">
              <FormLabel>Product Media</FormLabel>
              <div className="mt-2 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  {mediaPreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={src}
                        alt={`Preview ${index}`}
                        width={100}
                        height={100}
                        className="object-cover rounded-md w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 text-white text-xs py-1 rounded-b-md">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {mediaFields.length < 5 && (
                  <label
                    htmlFor="image-upload"
                    className="border bg-gray-50 border-dashed border-gray-300 p-4 w-full flex flex-col items-center justify-center hover:border-primary cursor-pointer rounded-md"
                  >
                    <Upload className="h-8 w-8 text-gray-400 mb-1" />
                    <p className="text-sm text-gray-500">Click to upload</p>
                    <p className="text-xs text-gray-400">
                      ({mediaFields.length}/5 images)
                    </p>
                  </label>
                )}
                <Input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                <FormMessage>
                  {form.formState.errors.media?.root?.message}
                </FormMessage>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Product"}
          </PrimaryButton>
        </div>
      </form>
    </Form>
  );
}
