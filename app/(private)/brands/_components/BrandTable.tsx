"use client";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { useBrandStore } from "@/stores/brand.store";
import { BrandDTO } from "../brand.dto";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default function BrandTable({
  onEdit,
}: {
  onEdit?: (brand: BrandDTO) => void;
}) {
  const { brands, deleteBrand } = useBrandStore();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      await deleteBrand(id);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brands.length > 0 ? (
          brands.map((brand, index) => (
            <TableRow key={brand._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="relative w-12 h-12 bg-gray-100 rounded border">
                  {brand.image && (
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      layout="fill"
                      objectFit="contain"
                      className="rounded"
                    />
                  )}
                </div>
              </TableCell>
              <TableCell>{brand.name}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit?.(brand)}
                    className="p-1 text-blue-600 hover:bg-gray-100 rounded"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(brand._id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No brands found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
