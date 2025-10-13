import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash } from "lucide-react";
import ActionButton from "@/app/components/button/ActionButton";
import { TableCell, TableRow } from "@/components/ui/table";
import { GetCategoryDTO } from "../category.dto";

export function SortableItem({ category }: { category: GetCategoryDTO }) {
  // useSortable hook provides all the tools we need
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category.id });

  // This style will be applied to the row to move it during drag events
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    // setNodeRef is attached to the element that will be dragged
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-10">
        {/* The listeners and attributes are for the drag handle */}
        <button {...attributes} {...listeners} className="p-1">
          <GripVertical className="h-5 w-5" />
        </button>
      </TableCell>
      <TableCell>#{category.id}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell className="w-3/4">{category.parent}</TableCell>
      <TableCell>
        <ActionButton>
          <Pencil />
        </ActionButton>
        <ActionButton>
          <Trash />
        </ActionButton>
      </TableCell>
    </TableRow>
  );
}
