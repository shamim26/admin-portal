export type GetCategoryDTO = {
  id: string;
  name: string;
  parent?: string | null;
};

export type CategoryDTO = {
  id: string;
  name: string;
  parent?: string | null;
  createdAt: Date;
  updatedAt: Date;
};