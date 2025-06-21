import { Button } from "@/components/ui/button";

export default function ActionButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button variant="ghost" size="sm" className={`p-0 ${className}`}>
      {children}
    </Button>
  );
}
