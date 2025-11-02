"use client";
import { Badge } from "@/components/ui/badge"; // 👈 Import Badge
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,

  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Eye, MoreHorizontal, Printer, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation"; //

type SimpleOrder = {
  _id: string;
  orderNumber: string;
  user: {
    name: string;
  };
  grandTotal: number;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled"
    | string;
  paymentMethod: string;
  createdAt: string;
};

type OrderTableProps = {
  orders: SimpleOrder[];
};

// 2. Formatters (you can move these to a utils file)
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD", // Or 'BDT' as needed
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function OrderTable({ orders }: OrderTableProps) {
  const router = useRouter();

  // 3. Helper to get badge variant based on status
  const getStatusVariant = (
    status: SimpleOrder["status"]
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Pending":
        return "secondary"; // Gray
      case "Processing":
        return "default"; // Blue/Default
      case "Shipped":
        return "outline"; // Border
      case "Delivered":
        return "default"; // Or you can use a custom 'success' variant
      case "Cancelled":
        return "destructive"; // Red
      default:
        return "secondary";
    }
  };
  const ALL_STATUSES = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

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
        {/* 4. Handle empty state */}
        {orders.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={7}
              className="h-24 text-center text-muted-foreground"
            >
              No orders found.
            </TableCell>
          </TableRow>
        ) : (
          /* 5. Map over real order data */
          orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.user?.name || "N/A"}</TableCell>
              <TableCell>{formatCurrency(order.grandTotal)}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              {/* 3. Actions cell with Dropdown */}
              <TableCell className="">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="rounded">
                    <DropdownMenuItem
                      onClick={() => router.push(`/orders/${order._id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/orders/print/${order._id}`)
                      }
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print Invoice
                    </DropdownMenuItem>

                    {/* 4. "Change Status" Sub-Menu */}
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        Change Status
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="rounded">
                        {ALL_STATUSES.map((status) => (
                          <DropdownMenuItem
                            key={status}
                            disabled={order.status === status}
                            // onClick={() => onStatusChange(order._id, status)}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSeparator />

                    {/* 5. Delete Action (triggers modal) */}
                    <DropdownMenuItem
                      className="text-red-600"
                      // onClick={() => setOrderToDelete(order)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Order
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
