"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import useOrderStore from "@/stores/order.store";
import { Spinner } from "@/components/ui/spinner";

export default function PrintOrderPage() {
  const { id } = useParams();
  const { currentOrder, fetchOrderById, loading } = useOrderStore();

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchOrderById(id);
    }
  }, [id, fetchOrderById]);

  useEffect(() => {
    if (currentOrder && !loading) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [currentOrder, loading]);

  if (loading || !currentOrder) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-[210mm] mx-auto p-8 bg-white text-black print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
          <p className="text-gray-600">#{currentOrder.orderNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Crisp Store</h2>
          <p className="text-sm text-gray-500">123 Business St</p>
          <p className="text-sm text-gray-500">City, Country</p>
          <p className="text-sm text-gray-500">support@crisp.com</p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
            Bill To
          </h3>
          <p className="font-semibold">{currentOrder.user?.name}</p>
          <p>{currentOrder.shippingAddress}</p>
          <p>{currentOrder.phone}</p>
          <p>{currentOrder.user?.email}</p>
        </div>
        <div className="text-right">
          <div className="space-y-1">
            <div className="flex justify-end gap-4">
              <span className="text-gray-500">Date:</span>
              <span>
                {new Date(currentOrder.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-500">Status:</span>
              <span className="capitalize">{currentOrder.status}</span>
            </div>
            <div className="flex justify-end gap-4">
              <span className="text-gray-500">Payment:</span>
              <span className="capitalize">{currentOrder.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left py-3">Item</th>
            <th className="text-center py-3">Qty</th>
            <th className="text-right py-3">Price</th>
            <th className="text-right py-3">Total</th>
          </tr>
        </thead>
        <tbody>
          {currentOrder.items.map((item, index) => {
            const productName = item.product_id?.name || "Product";
            const total = item.quantity * item.priceAtPurchase;
            return (
              <tr key={index} className="border-b border-gray-100">
                <td className="py-3">
                  <p className="font-medium">{productName}</p>
                  <p className="text-xs text-gray-500">{item.variant_sku}</p>
                </td>
                <td className="text-center py-3">{item.quantity}</td>
                <td className="text-right py-3">
                  ${item.priceAtPurchase.toFixed(2)}
                </td>
                <td className="text-right py-3">${total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${currentOrder.totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${currentOrder.totals.shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Discount</span>
            <span>-${currentOrder.totals.discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
            <span>Total</span>
            <span>${currentOrder.totals.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t pt-8 text-center text-sm text-gray-500">
        <p>Thank you for your business!</p>
      </div>

      <style jsx global>{`
        @page {
          margin: 0;
        }
        @media print {
          body {
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
