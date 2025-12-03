"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import { SortableItem } from "./SortableItems";

import { useCategoryStore } from "@/stores/category.store";

// Initial data removed in favor of store

export default function CategoryTable() {
  const { categories, reorderCategories } = useCategoryStore();

  // Define sensors to detect drag operations (e.g., pointer/mouse)
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  // This function is called when a drag operation ends
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((item) => item.id === active.id);
      const newIndex = categories.findIndex((item) => item.id === over.id);
      const reorderedCategories = arrayMove(categories, oldIndex, newIndex);

      // Update store and persist
      reorderCategories(reorderedCategories);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead className="w-10">#</TableHead>{" "}
            <TableHead>Name</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead className="pl-7">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* SortableContext provides the context for the sortable items */}
          <SortableContext
            items={categories}
            strategy={verticalListSortingStrategy}
          >
            {categories.length > 0 ? (
              categories.map((category) => (
                <SortableItem key={category.id} category={category} />
              ))
            ) : (
              <TableRow>
                <TableHead colSpan={5} className="h-24 text-center">
                  No categories found.
                </TableHead>
              </TableRow>
            )}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
