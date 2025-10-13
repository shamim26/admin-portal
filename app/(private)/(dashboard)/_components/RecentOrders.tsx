import ActionButton from "@/app/components/button/ActionButton";
import PageHeader from "@/app/components/PageHeader";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";

export default function RecentOrders() {
  return (
    <Card className="rounded w-full border-none shadow-none p-5 ">
      <PageHeader title="Recent Orders" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#OrderId</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Emma</TableCell>
            <TableCell>emma@example.com</TableCell>
            <TableCell>$100</TableCell>
            <TableCell>
              <ActionButton>
                <Eye size={16} />
              </ActionButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>John</TableCell>
            <TableCell>john@example.com</TableCell>
            <TableCell>$100</TableCell>
            <TableCell>
              <ActionButton>
                <Eye size={16} />
              </ActionButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  );
}
