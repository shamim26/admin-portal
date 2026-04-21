"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ActionButton from "@/app/components/button/ActionButton";
import DeleteModal from "@/app/components/modal/DeleteModal";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Eye, Printer, Trash2 } from "lucide-react";
import { Order } from "../order.dto";
import useOrderStore from "@/stores/order.store";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

// Use real Order type instead of SimpleOrder
type OrderTableProps = {
  orders: Order[];
  loading?: boolean;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT", // Assuming BDT based on context, previously USD
  }).format(amount);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function OrderTable({ orders, loading }: OrderTableProps) {
  const { updateOrderStatus, deleteOrder, bulkUpdateStatus } = useOrderStore();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Processing":
        return "default";
      case "Shipped":
        return "outline";
      case "Delivered":
        return "default"; // Fallback to default/primary
      case "Cancelled":
        return "destructive";
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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(orders.map((o) => o._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((prevId) => prevId !== id));
    }
  };

  const handleBulkStatusChange = async (status: string) => {
    if (selectedIds.length === 0) return;
    await bulkUpdateStatus(selectedIds, status);
    toast.success(`Updated ${selectedIds.length} orders to ${status}`);
    setSelectedIds([]);
  };

  const handleStatusChange = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    toast.success("Order status updated");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteOrder(id);
      toast.success("Order deleted");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="h-48 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-4 p-2 bg-muted/40 rounded-md animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium ml-2">
            {selectedIds.length} selected
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Update Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {ALL_STATUSES.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => handleBulkStatusChange(status)}
                >
                  Mark as {status}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedIds([])}
            className="ml-auto"
          >
            Cancel
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={
                  orders.length > 0 && selectedIds.length === orders.length
                }
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </TableHead>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-muted-foreground"
              >
                No orders found.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={selectedIds.includes(order._id)}
                    onChange={(e) =>
                      handleSelectOne(order._id, e.target.checked)
                    }
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell>{order.user?.name || "N/A"}</TableCell>
                <TableCell>
                  {formatCurrency(order.totals?.grandTotal || 0)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant={getStatusVariant(order.status)}
                        className="cursor-pointer hover:opacity-80"
                      >
                        {order.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {ALL_STATUSES.map((status) => (
                        <DropdownMenuItem
                          key={status}
                          disabled={order.status === status}
                          onClick={() => handleStatusChange(order._id, status)}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/orders/${order._id}`}>
                      <ActionButton>
                        <Eye className="h-4 w-4" />
                      </ActionButton>
                    </Link>
                    <Link href={`/orders/print/${order._id}`}>
                      <ActionButton>
                        <Printer className="h-4 w-4 text-primary" />
                      </ActionButton>
                    </Link>
                    <DeleteModal
                      title="Delete Order"
                      description={`Are you sure you want to delete order "${order.orderNumber}"? This action cannot be undone.`}
                      onConfirm={() => handleDelete(order._id)}
                      isDeleting={deletingId === order._id}
                    >
                      <ActionButton>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </ActionButton>
                    </DeleteModal>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
