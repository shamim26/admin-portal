export type GetCategoryDTO = {
  id: number;
  name: string;
  parent?: string;
};

export type CategoryDTO = {
  id: number;
  name: string;
  parent?: string;
  createdAt: Date;
  updatedAt: Date;
};