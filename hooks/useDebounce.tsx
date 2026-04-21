import { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // You only want to debounce if the user type 3+ chars OR clears the input fully
    if (value.length >= 3 || value.length === 0) {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      return () => clearTimeout(handler);
    }
  }, [value, delay]);
  return debouncedValue;
};
export default useDebounce;
