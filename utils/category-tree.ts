import { CategoryDTO } from "@/app/(private)/categories/category.dto";

export interface CategoryNode extends CategoryDTO {
  children: CategoryNode[];
}

export function buildCategoryTree(categories: CategoryDTO[]): CategoryNode[] {
  const categoryMap = new Map<string, CategoryNode>();
  const tree: CategoryNode[] = [];

  // First pass: Create nodes and map them
  categories.forEach((category) => {
    categoryMap.set(category.id.toString(), { ...category, children: [] });
  });

  // Second pass: Link children to parents
  categories.forEach((category) => {
    const node = categoryMap.get(category.id.toString())!;

    if (category.parent && categoryMap.has(category.parent)) {
      const parentNode = categoryMap.get(category.parent);
      parentNode?.children.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
}
