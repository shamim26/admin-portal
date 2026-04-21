export type Customer = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  role: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;

  // Added by stats
  totalOrders?: number;
  totalSpent?: number;
  lastActivityDate?: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type GetCustomerDTO = {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
};
