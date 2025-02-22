"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderItemType>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => {
      // Add a null check for row.original.product
      const product = row.original.product;
      if (!product) {
        return <span>No product available</span>; // Fallback if product is null/undefined
      }

      return (
        <Link
          href={`/products/${product._id}`} // Use the validated product object
          className="hover:text-red-1"
        >
          {product.title}
        </Link>
      );
    },
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
];