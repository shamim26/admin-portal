import { Pencil, Trash } from "lucide-react";
import ActionButton from "@/app/components/button/ActionButton";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";

export default function CategoryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="pl-7">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell className="w-4/5">Category {index + 1}</TableCell>
            <TableCell>
              <ActionButton>
                <Pencil />
              </ActionButton>
              <ActionButton>
                <Trash />
              </ActionButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
