export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface UserDocument {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: Address;
  role: string;
  isBanned: boolean;
  refreshToken?: string;
}
