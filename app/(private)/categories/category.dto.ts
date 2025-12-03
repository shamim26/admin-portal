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
  id: string;
  name: string;
  parent?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
