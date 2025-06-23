import { Pencil, Trash } from "lucide-react";
import ActionButton from "@/app/components/button/ActionButton";

export default function CategoryTable() {
  return (
    <div className="w-full bg-white rounded">
      <div className="flex justify-between items-center border-b px-4 py-2 bg-gray-200 font-semibold">
        <span className="w-1/12">#</span>
        <span className="w-11/12">Name</span>
        <span className="w-1/12">Action</span>
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center px-4 py-3 border-b"
        >
          <span className="w-1/12">{index + 1}</span>
          <span className="w-11/12">Category {index + 1}</span>
          <div className="w-1/11 flex items-center">
            <ActionButton>
              <Pencil />
            </ActionButton>
            <ActionButton>
              <Trash color="red" />
            </ActionButton>
          </div>
        </div>
      ))}
    </div>
  );
}
