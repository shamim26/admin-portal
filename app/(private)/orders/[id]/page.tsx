"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Printer,
  ArrowLeft,
  Package,
  MapPin,
  CreditCard,
  User,
  Calendar,
  Truck,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import useOrderStore from "@/stores/order.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { currentOrder, fetchOrderById, loading, updateOrderStatus, error } =
    useOrderStore();

  useEffect(() => {
    if (id) {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  const handlePrint = () => {
    // Navigate to print page
    window.open(`/orders/print/${id}`, "_blank");
  };

  const handleStatusChange = async (newStatus: string) => {
    await updateOrderStatus(id, newStatus);
    toast.success("Order status updated");
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-destructive">{error}</h2>
        <Button onClick={() => fetchOrderById(id)}>Retry</Button>
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-semibold text-muted-foreground">
          Order not found
        </h2>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (
      status // Case sensitive match with backend ENUM ideally, but safe to be loose or exact
    ) {
      case "Pending":
        return "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25 border-yellow-200";
      case "Processing":
        return "bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-200";
      case "Shipped":
        return "bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 border-purple-200";
      case "Delivered":
        return "bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-200";
      case "Cancelled":
        return "bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-200";
      default:
        return "bg-gray-500/15 text-gray-700 hover:bg-gray-500/25 border-gray-200";
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto space-y-8 p-6 animate-in fade-in duration-500 print:p-0 print:max-w-none">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-full border-dashed"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
            <p className="text-sm text-muted-foreground">
              View and manage order #{currentOrder.orderNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={currentOrder.status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="h-4 w-4" />
            Print Order
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Order Items</CardTitle>
                </div>
                <Badge
                  className={`${getStatusColor(
                    currentOrder.status,
                  )} border px-3 py-1 capitalize`}
                >
                  {currentOrder.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">Product</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right pr-6">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrder.items.map((item, index) => {
                    const product =
                      typeof item.product_id === "object"
                        ? item.product_id
                        : null;
                    const productName = product?.name || "Product Name N/A";
                    const productId =
                      product?._id ||
                      (typeof item.product_id === "string"
                        ? item.product_id
                        : "N/A");
                    const total = item.quantity * item.priceAtPurchase;

                    return (
                      <TableRow key={index} className="hover:bg-muted/30">
                        <TableCell className="pl-6 font-medium">
                          <div className="flex flex-col">
                            <span>{productName}</span>
                            <span className="text-xs text-muted-foreground">
                              ID: {productId}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.priceAtPurchase.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right pr-6 font-semibold">
                          ${total.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Payment & Summary */}
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Payment Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${currentOrder.totals?.subtotal?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${currentOrder.totals?.shipping?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span>-${currentOrder.totals?.discount?.toFixed(2)}</span>
                </div>
                <div className="my-4 h-px bg-border" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    ${currentOrder.totals?.grandTotal?.toFixed(2)}
                  </span>
                </div>
                <div className="mt-4 rounded-lg bg-muted/50 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-muted-foreground">
                      Payment Method
                    </span>
                    <span className="font-semibold capitalize">
                      {currentOrder.paymentMethod}
                    </span>
                  </div>
                  {currentOrder.transactionId && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-medium text-muted-foreground">
                        Transaction ID
                      </span>
                      <span className="font-mono">
                        {currentOrder.transactionId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Customer & Shipping */}
        <div className="space-y-6">
          {/* Customer Details */}
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Customer</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">
                    {currentOrder.user?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {currentOrder.user?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">
                    {currentOrder.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Shipping Address</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Truck className="h-4 w-4" />
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {/* Address might be string or object depending on implementation detail. DTO says string. */}
                  <p>{currentOrder.shippingAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Info */}
          <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Order Timeline</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Placed on</span>
                <span className="font-medium">
                  {formatDate(currentOrder.createdAt)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Updated</span>
                <span className="font-medium">
                  {formatDate(currentOrder.updatedAt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
