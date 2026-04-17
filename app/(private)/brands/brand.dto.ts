export interface BrandDTO {
  _id: string;
  name: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GetBrandDto {
  page?: number;
  limit?: number;
  search?: string;
}
