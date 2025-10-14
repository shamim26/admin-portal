import { buildCategoryTree } from "@/utils/category-tree"; // Adjust import path
import { TreeNode } from "./TreeNode";
import { CategoryDTO } from "../category.dto";

interface TreeViewProps {
  categories: CategoryDTO[];
}

export default function TreeView({ categories }: TreeViewProps) {
  // 1. Transform the flat data into a nested tree structure
  

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Category Structure</h2>
      {/* 2. Map over the root nodes to start the recursive rendering
      {categoryTree.map((rootNode) => (
        <TreeNode key={rootNode.id} node={rootNode} />
      ))} */}
    </div>
  );
}
