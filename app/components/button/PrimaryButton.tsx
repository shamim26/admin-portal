import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PrimaryButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  children: React.ReactNode;
};

export default function PrimaryButton({
  children,
  className,
  ...props
}: PrimaryButtonProps) {
  return (
    <Button
      className={cn(
        `bg-primary text-white px-4 py-2 rounded cursor-pointer`,
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
