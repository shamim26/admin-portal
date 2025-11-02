"use client";

import PrimaryButton from "@/app/components/button/PrimaryButton";
import CustomInput from "@/app/components/input-fields/CustomInput";
import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { useState } from "react";
import {
  FieldArrayWithId,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { ProductFormValues } from "./ProductForm";
import { TagInput } from "@/app/components/input-fields/TagInput";

// The Cartesian Product utility function
const cartesian = <T,>(...arrays: T[][]): T[][] => {
  return arrays.reduce<T[][]>((acc, current) => {
    if (acc.length === 0) return current.map((item) => [item]);
    return acc.flatMap((combo) => current.map((item) => [...combo, item]));
  }, []);
};

type VariantField = FieldArrayWithId<ProductFormValues, "variants", "id">;

export default function ProductVariant() {
  const { control } = useFormContext();

  // useFieldArray for the *final* variants list that will be submitted
  const {
    fields: variantFields,
    remove: removeVariant,
    replace: replaceVariants,
  } = useFieldArray({
    control: control,
    name: "variants",
  });

  // --- NEW: State for defining option groups ---
  const [optionGroups, setOptionGroups] = useState([
    { name: "", values: [] as string[] },
  ]);

  const handleOptionGroupNameChange = (index: number, newName: string) => {
    const updatedGroups = [...optionGroups];
    updatedGroups[index].name = newName;
    setOptionGroups(updatedGroups);
  };

  const handleOptionGroupValuesUpdate = (
    index: number,
    newValues: string[]
  ) => {
    const updatedGroups = [...optionGroups];
    updatedGroups[index].values = newValues;
    setOptionGroups(updatedGroups);
  };

  const addOptionGroup = () =>
    setOptionGroups([...optionGroups, { name: "", values: [] }]);

  const removeOptionGroup = (index: number) => {
    setOptionGroups(optionGroups.filter((_, i) => i !== index));
    replaceVariants([]); // Clear variants when an option group is removed
  };

  // --- NEW: The Generator Handler ---
  const handleGenerateVariants = () => {
    // Filter out groups that don't have a name or values
    const validGroups = optionGroups.filter(
      (g) => g.name && g.values.length > 0
    );
    if (validGroups.length === 0) return;

    // Get the arrays of values
    const valueArrays = validGroups.map((g) => g.values);

    // Calculate the combinations
    const combinations = cartesian(...valueArrays);

    // Create the new variants for react-hook-form
    const newVariants = combinations.map((combo) => {
      const options = combo.map((value, index) => ({
        option_name: validGroups[index].name,
        option_value: value,
      }));
      // Suggest a simple auto-generated SKU
      const sku = options
        .map((o) => o.option_value.substring(0, 3))
        .join("-")
        .toUpperCase();

      return {
        sku,
        price: 0,
        stock: 0,
        options,
      };
    });

    // Replace the entire variants array in the form state
    replaceVariants(newVariants);
  };
  return (
    <>
      {/* --- Part 1: Option Definition UI --- */}
      <div className="space-y-4">
        {optionGroups.map((group, index) => (
          <div
            key={index}
            className="flex items-start gap-4 p-4 border rounded-md"
          >
            <div className="flex-1 space-y-2">
              <FormLabel>Option Name</FormLabel>
              <Input
                type="text"
                value={group.name}
                onChange={(e) =>
                  handleOptionGroupNameChange(index, e.target.value)
                }
                placeholder="e.g., Color, Storage, Ram, Size"
              />
              <FormItem>
                <FormLabel>Option Values</FormLabel>
                <TagInput
                  onChange={(values) =>
                    handleOptionGroupValuesUpdate(index, values)
                  }
                  value={group.values}
                  placeholder="e.g., Red, 256gb, 8gb, Large"
                />
                <p className="text-xs text-gray-500">
                  Separate different values with a comma (,)
                </p>
              </FormItem>
            </div>
            <PrimaryButton
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeOptionGroup(index)}
              className="bg-transparent -mt-3 -mr-3"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </PrimaryButton>
          </div>
        ))}
      </div>
      {/* --- Part 2: Variant Generation Controls --- */}
      <div className="flex justify-between items-center">
        <PrimaryButton type="button" variant="outline" onClick={addOptionGroup}>
          <Plus className="h-4 w-4 mr-2" /> Add option
        </PrimaryButton>
        <PrimaryButton type="button" onClick={handleGenerateVariants}>
          <Wand2 className="h-4 w-4 mr-2" /> Generate Variants
        </PrimaryButton>
      </div>

      <hr />

      {/* --- Part 3: Generated Variants Table --- */}
      <h3 className="text-lg font-semibold">Generated Variants</h3>
      {variantFields.length > 0 ? (
        <div className="space-y-4">
          {variantFields.map((field, index) => {
            const variantField = field as VariantField;
            return (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center border p-3 rounded-md"
              >
                <div className="md:col-span-1">
                  <FormLabel className="mb-3">Options</FormLabel>
                  <p>
                    {variantField.options.map((o) => (
                      <span
                        key={o.option_name}
                        className="text-sm text-gray-600 mr-1"
                      >
                        <strong>{o.option_name}:</strong> {o.option_value}
                      </span>
                    ))}
                  </p>
                </div>
                <FormField
                  name={`variants.${index}.sku`}
                  control={control}
                  render={({ field }) => (
                    <CustomInput type="text" label="SKU" field={field} />
                  )}
                />
                <FormField
                  name={`variants.${index}.price`}
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      label="Price ($)"
                      field={field}
                      type="number"
                    />
                  )}
                />
                <FormField
                  name={`variants.${index}.stock`}
                  control={control}
                  render={({ field }) => (
                    <CustomInput label="Stock" field={field} type="number" />
                  )}
                />
                <PrimaryButton
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mt-5"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </PrimaryButton>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 border-dashed border-2 rounded-md">
          <p className="text-gray-500">
            Define options and click `Generate Variants` to see them here.
          </p>
        </div>
      )}
    </>
  );
}
