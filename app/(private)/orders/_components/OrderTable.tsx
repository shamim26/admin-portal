import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function OrderTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>#12345</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>$299.99</TableCell>
          <TableCell>Pending</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell>2024-01-15</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
