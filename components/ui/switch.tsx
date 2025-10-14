// components/ui/CustomSwitch.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class merging

interface CustomSwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  className?: string;
}

export const CustomSwitch = ({
  checked,
  onCheckedChange,
  id,
  className,
}: CustomSwitchProps) => {
  const toggleSwitch = () => {
    onCheckedChange(!checked);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggleSwitch}
      id={id}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ",
        checked ? "bg-primary" : "bg-input", // Primary color when checked, input color when unchecked
        className
      )}
    >
      <span className="sr-only">Toggle switch</span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
};
