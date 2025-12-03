import { CategoryNode } from "@/utils/category-tree";
import { useState } from "react";
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react";

interface TreeNodeProps {
  node: CategoryNode;
  level?: number;
}

export function TreeNode({ node, level = 0 }: TreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
        style={{ paddingLeft: `${level * 1.5}rem` }}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <span className="w-4 h-4 flex items-center justify-center">
          {hasChildren &&
            (isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            ))}
        </span>

        {isOpen ? (
          <FolderOpen className="w-4 h-4 text-blue-500" />
        ) : (
          <Folder className="w-4 h-4 text-blue-500" />
        )}

        <span className="text-sm">{node.name}</span>
      </div>

      {isOpen && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
