export type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalCategories: number;
};

export type CategoryResponse = {
  categories: CategoryDTO[];
  pagination: Pagination;
};

export type CategoryDTO = {
  _id: string;
  name: string;
  parent?: { _id: string; name: string } | string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryTreeDTO = {
  _id: string;
  name: string;
  parent?: CategoryTreeDTO | string | null;
  children?: CategoryTreeDTO[];
  createdAt: Date;
  updatedAt: Date;
};
