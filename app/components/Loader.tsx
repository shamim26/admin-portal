import { Spinner } from "@/components/ui/spinner";

const Loader = ({
  variant,
}: {
  variant?:
    | "bars"
    | "default"
    | "circle"
    | "pinwheel"
    | "circle-filled"
    | "ellipsis"
    | "ring"
    | "infinite";
}) => {
  return (
    <div className="flex items-center justify-center h-screen">
      <Spinner variant={variant} />
    </div>
  );
};

export default Loader;
