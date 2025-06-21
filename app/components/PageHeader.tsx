export default function PageHeader({
  title,
  className,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h1 className={`text-xl font-semibold py-2 ${className}`}>{title}</h1>
  );
}
