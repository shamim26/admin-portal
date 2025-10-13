"use client";

import { useState } from "react";
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


// Initial data 
const initialCategories = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Category ${index + 1}`,
  parent: `Parent ${index + 1}`,
}));

export default function CategoryTable() {
  // Store categories in state so we can reorder them
  const [categories, setCategories] = useState(initialCategories);

  // Define sensors to detect drag operations (e.g., pointer/mouse)
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  // This function is called when a drag operation ends
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCategories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reorderedCategories = arrayMove(items, oldIndex, newIndex);

        return reorderedCategories;
        //TODO: API call here to persist the new order
      });
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
            {categories.map((category) => (
              <SortableItem key={category.id} category={category} />
            ))}
          </SortableContext>
        </TableBody>
      </Table>
    </DndContext>
  );
}
