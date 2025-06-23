"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomInput from "@/app/components/input-fields/CustomInput";
import PrimaryButton from "@/app/components/button/PrimaryButton";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be positive"),
  category: z.string().min(1, "Category is required"),
  featuredImage: z.string().url("Must be a valid URL"),
  images: z.array(z.string().url()).optional(),
  brand: z.string().optional(),
  size: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
  quantity: z.number().min(0, "Quantity must be positive"),
});

export default function ProductForm() {
  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      category: "",
      featuredImage: "",
      images: [],
      brand: "",
      size: [],
      colors: [],
      quantity: 1,
    },
  });

  const onSubmit = (data: z.infer<typeof productSchema>) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <CustomInput
                field={field}
                placeholder="Enter product name"
                type="text"
              />
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <CustomInput
                field={field}
                placeholder="Enter price"
                type="number"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <CustomInput
              field={field}
              placeholder="Enter product description"
              type="text"
            />
          )}
        />
        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <CustomInput
              field={field}
              placeholder="Enter featured image URL"
              type="url"
            />
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <CustomInput
              field={field}
              placeholder="Enter category"
              type="text"
            />
          )}
        />
        <PrimaryButton type="submit" className="w-full">
          Add Product
        </PrimaryButton>
      </form>
    </Form>
  );
}
