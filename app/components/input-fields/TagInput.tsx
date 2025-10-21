"use client";

import React, { useState } from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps extends Omit<InputProps, "value" | "onChange"> {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, onChange, placeholder, ...props }, ref) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const newTag = inputValue.trim();
        if (newTag && !value.includes(newTag)) {
          onChange([...value, newTag]);
        }
        setInputValue("");
      }
    };

    const removeTag = (tagToRemove: string) => {
      onChange(value.filter((tag: string) => tag !== tagToRemove));
    };

    return (
      <div>
        <div className="flex flex-wrap gap-2 rounded-md border border-input p-2">
          {value.map((tag: string, index: number) => (
            <Badge key={index} variant="default" className="rounded">
              {tag}
              <button
                type="button"
                className="ml-2 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => removeTag(tag)}
              >
                <X className="h-3 w-3 hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <Input
            ref={ref}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || "Add a tag..."}
            className="flex-grow border-none shadow-none focus-visible:ring-0"
            {...props}
          />
        </div>
      </div>
    );
  }
);

TagInput.displayName = "TagInput";
