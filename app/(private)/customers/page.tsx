"use client";

import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useEffect, useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import KpiCard from "@/app/components/card/KPICard";
import { Users, UserX, ShieldCheck } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";
import useQuerySync from "@/hooks/useQuerySync";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomerStore } from "@/stores/customer.store";
import CustomerTable from "./_components/CustomerTable";

export default function CustomersPage() {
  const {
    customers,
    totalCustomers,
    totalPages,
    currentPage,
    setPage,
    setFilters,
    filters,
  } = useCustomerStore();

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  useQuerySync({
    search: debouncedSearch,
    page: currentPage,
    role: filters.role === "all" ? undefined : filters.role,
    status: filters.status === "all" ? undefined : filters.status,
  });

  const totalAdmin = customers.filter((c) => c.role === "admin").length;
  const totalRestricted = customers.filter((c) => c.isBanned).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <PageHeader title="Users & Customers" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={filters.role || "all"}
            onValueChange={(val) =>
              setFilters({ role: val === "all" ? undefined : val })
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.status || "all"}
            onValueChange={(val) =>
              setFilters({ status: val === "all" ? undefined : val })
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>

          <SearchField
            placeholder="Search users..."
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <KpiCard title="Total Users" icon={<Users />} value={totalCustomers} />
        <KpiCard title="Admins" icon={<ShieldCheck />} value={totalAdmin} />
        <KpiCard title="Restricted" icon={<UserX />} value={totalRestricted} />
      </div>

      <CustomerTable />

      <div className="mt-4">
        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
