export type Customer = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  role: string;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};
