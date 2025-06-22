import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function CategoryTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Category 1</TableCell>
          <TableCell>Description 1</TableCell>
          <TableCell>Actions 1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
