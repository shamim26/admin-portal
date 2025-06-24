import { Card } from "@/components/ui/card";

import ActionButton from "@/app/components/button/ActionButton";
import PageHeader from "@/app/components/PageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2Icon } from "lucide-react";

export default function LowStock() {
  return (
    <Card className="rounded border-none shadow-none p-5 ">
      <PageHeader title="Low Stock" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Product 1</TableCell>
            <TableCell>10</TableCell>
            <TableCell>100</TableCell>
            <TableCell>
              <ActionButton>
                <Edit2Icon size={16} />
              </ActionButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Product 1</TableCell>
            <TableCell>10</TableCell>

            <TableCell>100</TableCell>
            <TableCell>
              <ActionButton>
                <Edit2Icon size={16} />
              </ActionButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
