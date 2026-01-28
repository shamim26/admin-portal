export type Order = {
  _id: string; // Changed from id: number
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    shipping: number;
    discount: number;
    grandTotal: number;
  };
  status: OrderStatus;
  shippingAddress: string; // Backend sends string currently, might need object if changed later, but model says string
  phone: string;
  paymentMethod: string;
  transactionId?: string;
  trackingNumber?: string;
  createdAt: string; // Date comes as string from JSON
  updatedAt: string;
};

export type OrderItem = {
  product_id: string | { _id: string; name: string; images: string[] };
  variant_sku: string;
  quantity: number;
  priceAtPurchase: number;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";
