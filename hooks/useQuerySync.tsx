import { useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function useQuerySync(
  params: Record<string, string | number | boolean | undefined | null>
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Avoid running on strict initial mount to prevent hydration mismatch 
    // and let the native fetch commands fire properly
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const currentQuery = new URLSearchParams(Array.from(searchParams.entries()));
    let hasChanges = false;

    Object.entries(params).forEach(([key, value]) => {
      // Remove from URL if empty, or if it's the default page 1
      if (
        value === undefined ||
        value === null ||
        value === "" ||
        (key === "page" && value === 1)
      ) {
        if (currentQuery.has(key)) {
          currentQuery.delete(key);
          hasChanges = true;
        }
      } else {
        if (currentQuery.get(key) !== String(value)) {
          currentQuery.set(key, String(value));
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      // replace instead of push prevents polluting the browser history with hundreds of search keystrokes
      router.replace(`${pathname}?${currentQuery.toString()}`, { scroll: false });
    }
  }, [params, pathname, router, searchParams]);
}
