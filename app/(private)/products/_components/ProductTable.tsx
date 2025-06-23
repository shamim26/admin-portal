import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

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
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Product 1</TableCell>
          <TableCell>Description 1</TableCell>
          <TableCell>$99.99</TableCell>
          <TableCell>Electronics</TableCell>
          <TableCell>10</TableCell>
          <TableCell>Actions 1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
