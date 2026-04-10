import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil, Trash } from "lucide-react";
import ActionButton from "@/app/components/button/ActionButton";
import { TableCell, TableRow } from "@/components/ui/table";
import { CategoryDTO } from "../category.dto";
import DeleteModal from "@/app/components/modal/DeleteModal";
import { useCategoryStore } from "@/stores/category.store";

export function SortableItem({
  category,
  index,
  onEdit,
}: {
  category: CategoryDTO;
  index: number;
  onEdit?: (category: CategoryDTO) => void;
}) {
  // useSortable hook provides all the tools we need
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: category._id });

  const { deleteCategory } = useCategoryStore();

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
      <TableCell>{index}</TableCell>
      <TableCell>{category.name}</TableCell>
      <TableCell className="w-3/4">
        {typeof category.parent === "object" ? category.parent?.name : category.parent}
      </TableCell>
      <TableCell>
        <ActionButton onClick={() => onEdit && onEdit(category)}>
          <Pencil />
        </ActionButton>
        <DeleteModal
          title={`Delete ${category.name}?`}
          onConfirm={() => deleteCategory(category._id)}
        >
          <ActionButton>
            <Trash />
          </ActionButton>
        </DeleteModal>
      </TableCell>
    </TableRow>
  );
}
