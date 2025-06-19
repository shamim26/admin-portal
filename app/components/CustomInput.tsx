"use client";

import { Button } from "@/components/ui/button";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";

interface CustomInputProps<T extends FieldValues> {
  label?: string;
  type: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  field: ControllerRenderProps<T>;
}

export default function CustomInput<T extends FieldValues>({
  label,
  type,
  field,
  placeholder,
  disabled,
  className,
  value,
  onChange,
}: CustomInputProps<T>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      field.onChange(e.target.value === "" ? "" : Number(e.target.value));
    } else {
      field.onChange(e);
    }
  };
  const isPasswordType = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <div className="relative mb-2">
          <Input
            {...field}
            type={isPasswordType ? (showPassword ? "text" : "password") : type}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange || handleChange}
            value={value ?? field.value}
          />

          {isPasswordType && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          )}
        </div>
      </FormControl>
      <FormMessage className="text-red-500" />
    </FormItem>
  );
}
