import { buildCategoryTree } from "@/utils/category-tree";
import { useCategoryStore } from "@/stores/category.store";
import { TreeNode } from "./TreeNode";

export default function TreeView() {
  const { categories } = useCategoryStore();
  const categoryTree = buildCategoryTree(categories);

  if (categories.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500">No categories found</div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h2 className="text-lg font-semibold mb-4">Category Structure</h2>
      <div className="flex flex-col gap-1">
        {categoryTree.map((rootNode) => (
          <TreeNode key={rootNode.id} node={rootNode} />
        ))}
      </div>
    </div>
  );
}
