import ActionButton from "@/app/components/button/ActionButton";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import useProductStore from "@/stores/product.store";
import { Eye, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/lib/slugs";
import { Product, CategoryReference, BrandReference, ProductVariant } from "../product.dto";
import DeleteModal from "@/app/components/modal/DeleteModal";
import { useState } from "react";

export default function ProductTable() {
  const { products, loading, deleteProduct } = useProductStore();

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteProduct(id);
    } finally {
      setDeletingId(null);
    }
  };


  if (loading) {
    return <div className="p-4 text-center">Loading products...</div>;
  }

  if (products.length === 0) {
    return <div className="p-4 text-center">No products found.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead className="pl-8">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product: Product) => (
          <TableRow key={product._id}>
            <TableCell>
              <div className="relative h-10 w-10 overflow-hidden rounded">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200" />
                )}
              </div>
            </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>${product.pricing?.basePrice || 0}</TableCell>
            <TableCell>{typeof product.category === "object" ? (product.category as CategoryReference)?.name : product.category as string}</TableCell>
            <TableCell>{typeof product.brand === "object" ? (product.brand as BrandReference)?.name : product.brand as string}</TableCell>
            <TableCell>{product.variants ? product.variants.reduce((acc: number, v: ProductVariant) => acc + (v.stock || 0), 0) : 0}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link href={`${ROUTES.PRODUCTS}/${product._id}`}>
                  <ActionButton>
                    <Eye className="h-4 w-4" />
                  </ActionButton>
                </Link>
                <Link href={`${ROUTES.PRODUCTS_EDIT}/${product._id}`}>
                  <ActionButton>
                    <Pencil className="h-4 w-4 text-primary" />
                  </ActionButton>
                </Link>
                <DeleteModal
                  title="Delete Product"
                  description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
                  onConfirm={() => handleDelete(product._id as string)}
                  isDeleting={deletingId === product._id}
                >
                  <ActionButton>
                    <Trash className="h-4 w-4 text-red-500" />
                  </ActionButton>
                </DeleteModal>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
