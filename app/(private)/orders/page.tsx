"use client";

import OrderTable from "./_components/OrderTable";
import PageHeader from "@/app/components/PageHeader";
import SearchField from "@/app/components/input-fields/SearchField";
import { useEffect, useState } from "react";
import DynamicPagination from "@/app/components/DynamicPagination";
import KpiCard from "@/app/components/card/KPICard";
import {
  CheckCircleIcon,
  ClockIcon,
  ShoppingCartIcon,
  XCircleIcon,
} from "lucide-react";
import useOrderStore from "@/stores/order.store";
import useDebounce from "@/hooks/useDebounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ExportOrdersButton from "./_components/ExportOrdersButton";

export default function OrdersPage() {
  const {
    orders,
    loading,
    fetchOrders,
    initSocket,
    disconnectSocket,
    totalPages,
    currentPage,
    setPage,
    setFilters,
    filters,
  } = useOrderStore();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 500);

  // Initial fetch and socket setup
  useEffect(() => {
    fetchOrders();
    initSocket();

    // Polling fallback or just rely on socket
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);

    return () => {
      clearInterval(interval);
      disconnectSocket();
    };
  }, [fetchOrders, initSocket, disconnectSocket]);

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  // TODO: Fetch real stats from API if available, currently static or calculated from current page (inaccurate)
  // For now, we can render static or leave placeholders until a stats endpoint exists.

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <PageHeader title="Orders" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Added ExportOrdersButton here */}
          <ExportOrdersButton />
          <Select
            value={filters.status || "all"}
            onValueChange={(val) =>
              setFilters({ status: val === "all" ? undefined : val })
            }
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          <SearchField
            placeholder="Search orders..."
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
        <KpiCard
          title="Total Orders"
          icon={<ShoppingCartIcon />}
          value={orders.length} // Just current page count for now, ideally totalOrders from store
          // value={totalOrders} // Store has totalOrders
        />
        {/* These need backend stats endpoint to be accurate */}
        <KpiCard title="Pending" icon={<ClockIcon />} value={"-"} />
        <KpiCard title="Shipped" icon={<CheckCircleIcon />} value={"-"} />
        <KpiCard title="Cancelled" icon={<XCircleIcon />} value={"-"} />
      </div>

      <OrderTable orders={orders} loading={loading} />

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
