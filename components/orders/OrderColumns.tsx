"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

// Order Type
type OrderType = {
  _id: string;
  customerClerkId: string;
  email: string;
  name: string;
  totalAmount: number;
  createdAt: string; // Directly stored as a string in the database
};

export const columns: ColumnDef<OrderType>[] = [
  {
    accessorKey: "_id",
    header: "Order",
    cell: ({ row }) => {
      const orderId: string = row.original._id;
      return (
        <Link href={`/orders/${orderId}`} className="hover:text-red-1">
          {orderId}
        </Link>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Customer",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email: string = row.original.email || "N/A";
      return <span>{email}</span>;
    },
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => {
      const totalAmount: number = row.original.totalAmount;
      return `KSh${totalAmount.toFixed(2)}`;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const createdAt: string = row.original.createdAt || "N/A"; // Directly use string from DB
      return <span>{createdAt}</span>;
    },
  },
];
