"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "@/components/ui/form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategoryStore } from "@/stores/category.store";
import { CategoryDTO } from "../category.dto";

const categorySchema = z.object({
  name: z.string().min(1),
  parent: z.string().optional(),
});

export default function CategoryForm({
  isOpen,
  onClose,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CategoryDTO | null;
}) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      parent: "",
    },
  });

  const { createCategory, updateCategory, categoryTree, fetchCategoryTree } = useCategoryStore();

  useEffect(() => {
    if (isOpen && categoryTree.length === 0) {
      fetchCategoryTree();
    }
  }, [isOpen, categoryTree.length, fetchCategoryTree]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flattenTree = (nodes: any[], level = 0): any[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let flat: any[] = [];
    nodes.forEach((node) => {
      flat.push({
        ...node,
        displayName: "— ".repeat(level) + node.name,
      });
      if (node.children && node.children.length > 0) {
        flat = flat.concat(flattenTree(node.children, level + 1));
      }
    });
    return flat;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getDescendantIds = (nodes: any[], targetId: string, found = false): string[] => {
    let ids: string[] = [];
    nodes.forEach((node) => {
      const isTargetOrDescendant = found || node._id === targetId || node.id === targetId;
      if (isTargetOrDescendant && node._id !== targetId && node.id !== targetId) {
        ids.push(node._id || node.id);
      }
      if (node.children && node.children.length > 0) {
        ids = ids.concat(getDescendantIds(node.children, targetId, isTargetOrDescendant));
      }
    });
    return ids;
  };

  const formattedCategories = flattenTree(categoryTree);
  const invalidParentIds = initialData 
    ? [initialData._id, ...getDescendantIds(categoryTree, initialData._id)]
    : [];

  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        parent: typeof initialData.parent === "object" ? initialData.parent?._id : initialData.parent || "",
      });
    } else {
      form.reset({ name: "", parent: "" });
    }
  }, [initialData, form, isOpen]);

  const onSubmit = async (data: z.infer<typeof categorySchema>) => {
    const parentValue = data.parent === "none" || !data.parent ? undefined : data.parent;
    if (initialData) {
      const targetId = initialData._id;
      await updateCategory(targetId, data.name, parentValue);
    } else {
      await createCategory(data.name, parentValue);
    }
    onClose();
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Update Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <CustomInput
                  field={field}
                  placeholder="Enter category name"
                  type="text"
                />
              )}
            />
            <FormField
              control={form.control}
              name="parent"
              render={({ field }) => (
                <div className="space-y-1 w-full">
                  <label className="text-sm font-medium">Parent Category</label>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || "none"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {formattedCategories
                        .filter((c) => !invalidParentIds.includes(c._id) && !invalidParentIds.includes(c.id))
                        .map((c) => {
                          const valId = c._id;
                          return (
                          <SelectItem key={valId} value={valId as string}>
                            {c.displayName}
                          </SelectItem>
                        )})}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <PrimaryButton type="submit" className="mt-4">
              {initialData ? "Update Category" : "Add Category"}
            </PrimaryButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
