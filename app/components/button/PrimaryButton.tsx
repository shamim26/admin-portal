import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
};

export default function PrimaryButton({
  children,
  className,
  variant,
  size,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        `bg-primary text-white px-4 py-2 rounded cursor-pointer`,
        className
      )}
      size={size}
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
}
