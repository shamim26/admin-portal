"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PageHeader({
  title,
  className,
  showBackButton,
}: {
  title: string;
  className?: string;
  showBackButton?: boolean;
}) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      {showBackButton && (
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
      )}
      <h1 className={`text-xl font-semibold py-2 ${className}`}>{title}</h1>
    </div>
  );
}
