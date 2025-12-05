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
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/slugs";

export default function ProductTable() {
  const router = useRouter();
  const { products, loading, deleteProduct } = useProductStore();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
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
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div className="relative h-10 w-10 overflow-hidden rounded">
                {product.featuredImage ? (
                  <Image
                    src={product.featuredImage}
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
            <TableCell>${product.price}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.brand}</TableCell>
            <TableCell>{product.quantity}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link href={`${ROUTES.PRODUCTS}/${product.id}`}>
                  <ActionButton>
                    <Eye className="h-4 w-4" />
                  </ActionButton>
                </Link>
                <Link href={`${ROUTES.PRODUCTS_EDIT}/${product.id}`}>
                  <ActionButton>
                    <Pencil className="h-4 w-4 text-primary" />
                  </ActionButton>
                </Link>
                <ActionButton onClick={() => handleDelete(product.id)}>
                  <Trash className="h-4 w-4 text-red-500" />
                </ActionButton>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
