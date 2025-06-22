import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";

export default function SearchField({
  placeholder = "Search",
  className = "",
  searchValue = "",
  setSearchValue,
  ...props
}: {
  placeholder?: string;
  className?: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  props?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <div className={`relative bg-white ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        className="pr-10"
        value={searchValue}
        onChange={(e) => setSearchValue?.(e.target.value)}
        {...props}
      />
      <span className="absolute inset-y-0 right-3 flex items-center">
        {searchValue ? (
          <XIcon
            className="h-5 w-5 text-gray-400"
            onClick={() => setSearchValue?.("")}
          />
        ) : (
          <SearchIcon className="h-5 w-5 text-gray-400" />
        )}
      </span>
    </div>
  );
}
