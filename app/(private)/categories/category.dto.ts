export type GetCategoryDTO = {
  id: number;
  name: string;
  parent?: string | null;
};

export type CategoryDTO = {
  id: number;
  name: string;
  parent?: string | null;
  createdAt: Date;
  updatedAt: Date;
};