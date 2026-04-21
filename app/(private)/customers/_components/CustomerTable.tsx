"use client";

import { useCustomerStore } from "@/stores/customer.store";
import { Customer } from "../customer.dto";
import { Badge } from "@/components/ui/badge";
import ActionButton from "@/app/components/button/ActionButton";
import DeleteModal from "@/app/components/modal/DeleteModal";
import Link from "next/link";
import { Eye, UserCheck, ShieldBan } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/app/components/Loader";

export default function CustomerTable() {
  const { customers, loading, banCustomer, unbanCustomer, updateRole } =
    useCustomerStore();

  const handleRoleChange = async (id: string, role: string) => {
    const success = await updateRole(id, role);
    if (success) {
      toast.success("Role updated successfully");
    } else {
      toast.error("Failed to update role");
    }
  };

  const handleToggleBan = async (customer: Customer) => {
    let success = false;
    if (customer.isBanned) {
      success = await unbanCustomer(customer._id);
      if (success) toast.success("User has been unbanned");
    } else {
      success = await banCustomer(customer._id);
      if (success) toast.success("User has been banned");
    }

    if (!success) {
      toast.error("Failed to update ban status");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Joined Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={6}
              className="h-24 text-center text-muted-foreground"
            >
              No users found.
            </TableCell>
          </TableRow>
        ) : (
          customers.map((customer, index) => (
            <TableRow key={customer._id}>
              <TableCell className="font-medium">{index + 1}.</TableCell>
              <TableCell className="font-medium">
                <div>
                  <p>{customer.name}</p>
                  {customer.phone && (
                    <p className="text-xs text-muted-foreground">
                      {customer.phone}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>
                {customer.isBanned ? (
                  <Badge variant="destructive">Banned</Badge>
                ) : (
                  <Badge variant="secondary">Active</Badge>
                )}
              </TableCell>
              <TableCell>
                {customer.role === "admin" ? (
                  <Badge variant="default">{customer.role}</Badge>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:opacity-80"
                      >
                        {customer.role}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        disabled={customer.role === "user"}
                        onClick={() => handleRoleChange(customer._id, "user")}
                      >
                        Set as User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={customer.role === "admin"}
                        onClick={() => handleRoleChange(customer._id, "admin")}
                      >
                        Set as Admin
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
              <TableCell>
                {new Date(customer.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/customers/${customer._id}`}>
                    <ActionButton>
                      <Eye className="h-4 w-4" />
                    </ActionButton>
                  </Link>

                  {customer.role !== "admin" && (
                    <DeleteModal
                      title={customer.isBanned ? "Unban User" : "Ban User"}
                      description={
                        customer.isBanned
                          ? `Are you sure you want to restore access for ${customer.name}?`
                          : `Are you sure you want to ban ${customer.name}? They will lose access to the platform.`
                      }
                      onConfirm={() => handleToggleBan(customer)}
                    >
                      <ActionButton>
                        {customer.isBanned ? (
                          <UserCheck className="h-4 w-4 text-green-600" />
                        ) : (
                          <ShieldBan className="h-4 w-4 text-red-600" />
                        )}
                      </ActionButton>
                    </DeleteModal>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
