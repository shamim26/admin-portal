"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, FieldErrors, ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import CustomInput from "@/app/components/input-fields/CustomInput";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import SearchDropdown from "@/app/components/SearchDropdown";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import { X, Upload, Plus } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  offerPrice: z.number().optional(),
  category: z.string().min(1, "Category is required"),
  featuredImage: z.instanceof(File),
  images: z
    .array(z.instanceof(File))
    .max(4, "Maximum 4 images allowed")
    .optional(),
  brand: z.string().optional(),
  stock: z.number().min(0, "Stock must be positive"),
  size: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
});

export default function ProductForm() {
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [productImages, setProductImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      offerPrice: 0,
      category: "",
      featuredImage: undefined,
      images: [],
      brand: "",
      stock: 0,
      size: [],
      colors: [],
      quantity: 1,
    },
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    console.log(data);
  };

  const onError = (errors: FieldErrors<z.infer<typeof productSchema>>) => {
    console.log(errors);
  };

  const handleFeaturedImageUpload = (
    files: FileList | null,
    field: ControllerRenderProps<z.infer<typeof productSchema>, "featuredImage">
  ) => {
    if (!files) return;
    const file = files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setFeaturedImage(imageUrl);
      field.onChange(file);
    }
  };

  const handleImageUpload = (
    files: FileList | null,
    field: ControllerRenderProps<z.infer<typeof productSchema>, "images">
  ) => {
    if (!files) return;

    const newImages: string[] = [];
    const maxImages = 4;
    const currentCount = productImages.length;

    for (let i = 0; i < Math.min(files.length, maxImages - currentCount); i++) {
      const file = files[i];
      if (file && file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        newImages.push(imageUrl);
      }
    }

    const updatedImages = [...productImages, ...newImages];
    setProductImages(updatedImages);
    field.onChange(updatedImages);
  };

  const removeImage = (
    index: number,
    field: ControllerRenderProps<z.infer<typeof productSchema>, "images">
  ) => {
    const updatedImages = productImages.filter((_, i) => i !== index);
    setProductImages(updatedImages);
    field.onChange(updatedImages);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <div className="flex lg:flex-row flex-col gap-4 items-start">
          {/* Left: Product Fields */}
          <div className="flex flex-1 bg-white p-6 h-fit">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {/* Product Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <CustomInput
                    label="Product name"
                    field={field}
                    placeholder="Enter product name"
                    type="text"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="category"
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
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <CustomInput
                    label="Stock"
                    field={field}
                    placeholder="Enter stock quantity"
                    type="number"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="brand"
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
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <CustomInput
                    label="Price"
                    field={field}
                    placeholder="Enter price"
                    type="number"
                  />
                )}
              />
              <FormField
                control={form.control}
                name="offerPrice"
                render={({ field }) => (
                  <CustomInput
                    label="Offer price"
                    field={field}
                    placeholder="Enter offer price"
                    type="number"
                  />
                )}
              />
            </div>
          </div>
          {/* Right: Images */}
          <div className="w-full bg-white lg:w-1/3 flex flex-col gap-6 p-6">
            {/* Featured Image */}
            <FormField
              control={form.control}
              name="featuredImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Featured image</FormLabel>
                  <div className="flex flex-col items-center my-2">
                    {featuredImage ? (
                      <div className="flex justify-center w-full">
                        <div className="relative">
                          <Image
                            src={featuredImage}
                            alt="Featured preview"
                            className="object-contain"
                            width={200}
                            height={200}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFeaturedImage(null);
                              field.onChange(null);
                            }}
                            className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white p-1 text-xs cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="featured-image-upload"
                        className="border bg-white border-dashed border-gray-300 p-6 w-full flex flex-col items-center justify-center mb-3 hover:border-primary cursor-pointer"
                      >
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Upload image</p>
                      </label>
                    )}
                    <Input
                      id="featured-image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleFeaturedImageUpload(e.target.files, field);
                      }}
                    />
                  </div>
                </FormItem>
              )}
            />
            {/* Product Images */}
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Images (Max 4)</FormLabel>
                  <div className="space-y-3">
                    <div className="w-full flex gap-2 overflow-x-auto">
                      {productImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Product image ${index + 1}`}
                            width={100}
                            height={100}
                            className="object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, field)}
                            className="absolute top-0 rounded-full bg-red-500 text-white p-1 text-xs cursor-pointer hover:bg-red-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {productImages.length < 4 && (
                      <label
                        htmlFor="product-images-upload"
                        className="border bg-white border-dashed border-gray-300 p-4 w-full flex flex-col items-center justify-center hover:border-primary cursor-pointer"
                      >
                        <Plus className="h-6 w-6 text-gray-400 mb-1" />
                        <p className="text-xs text-gray-500">
                          Add image ({productImages.length}/4)
                        </p>
                      </label>
                    )}
                    <Input
                      id="product-images-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageUpload(e.target.files, field)}
                    />
                    {productImages.length > 0 && (
                      <p className="text-xs text-gray-500 text-center">
                        {productImages.length}/4 images uploaded
                      </p>
                    )}
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <PrimaryButton type="submit" className="ml-4">
          Add Product
        </PrimaryButton>
      </form>
    </Form>
  );
}
