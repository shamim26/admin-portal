import ActionButton from "@/app/components/button/ActionButton";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Eye, Pencil, Trash } from "lucide-react";

export default function ProductTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="pl-8">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 10 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>Product {index + 1}</TableCell>
            <TableCell>Description {index + 1}</TableCell>
            <TableCell>${Math.floor(Math.random() * 1000)}</TableCell>
            <TableCell>Electronics</TableCell>
            <TableCell>{Math.floor(Math.random() *124)}</TableCell>
            <TableCell>
              <ActionButton>
                <Eye />
              </ActionButton>
              <ActionButton>
                <Pencil className="text-primary" />
              </ActionButton>
              <ActionButton>
                <Trash color="red" />
              </ActionButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
