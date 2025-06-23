import { Button } from "@/components/ui/button";

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

export default function ActionButton({
  children,
  className,
  ...props
}: ActionButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`p-0 cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}
