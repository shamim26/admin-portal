"use client";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import CustomInput from "@/app/components/input-fields/CustomInput";
import PrimaryButton from "@/app/components/button/PrimaryButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useBrandStore } from "@/stores/brand.store";
import { BrandDTO } from "../brand.dto";
import Image from "next/image";
import { X } from "lucide-react";

const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function BrandForm({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BrandDTO | null;
}) {
  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
    },
  });

  const { createBrand, updateBrand, loading } = useBrandStore();

  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      form.reset({ name: initialData.name });
      setPreview(initialData.image);
    } else {
      form.reset({ name: "" });
      setPreview(null);
    }
    setNewFile(null);
  }, [initialData, form, isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setNewFile(null);
    setPreview(null);
  };

  const onSubmit = async (data: z.infer<typeof brandSchema>) => {
    const formData = new FormData();
    formData.append("name", data.name);
    
    // If not new file, and preview exists, it implies we keep existing image URL (handled by backend or we pass old image string if needed).
    // The backend `UpdateBrand` keeps old image if neither is provided?
    // Actually our backend: `finalImage = uploadedImages.length > 0 ? uploadedImages[0] : image;`
    if (newFile) {
      formData.append("image", newFile);
    } else if (preview) {
      formData.append("image", preview);
    }
    
    try {
      if (initialData) {
        await updateBrand(initialData._id, formData);
      } else {
        await createBrand(formData);
      }
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Update Brand" : "Add Brand"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <CustomInput
                  field={field}
                  placeholder="Enter brand name"
                  type="text"
                  label="Name"
                />
              )}
            />

            <FormItem>
              <FormLabel>Brand Image</FormLabel>
              <div className="mt-2 flex items-center gap-4">
                {preview ? (
                  <div className="relative w-24 h-24 border rounded">
                    <Image
                      src={preview}
                      alt="Preview"
                      layout="fill"
                      objectFit="contain"
                      className="rounded"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label
                    className="border-dashed border-2 p-4 rounded text-center cursor-pointer hover:bg-gray-50 flex-1"
                  >
                    Click to upload image
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </FormItem>

            <PrimaryButton type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : initialData ? "Update Brand" : "Add Brand"}
            </PrimaryButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
