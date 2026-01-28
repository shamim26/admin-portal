import { Order, OrderStatus } from "@/app/(private)/orders/order.dto";
import { OrderService } from "@/app/(private)/orders/order.service";
import { create } from "zustand";
import { toast } from "sonner";
import { socket } from "@/lib/socket";

type OrderStore = {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;

  // Pagination State
  totalPages: number;
  currentPage: number;
  totalOrders: number;

  // Filters
  filters: {
    search?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    paymentMethod?: string;
  };
  pollingInterval: NodeJS.Timeout | null;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  bulkUpdateStatus: (ids: string[], status: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  // Socket methods
  initSocket: () => void;
  disconnectSocket: () => void;

  // State setters
  setPage: (page: number) => void;
  setFilters: (filters: Partial<OrderStore["filters"]>) => void;
  startPolling: () => void;
  stopPolling: () => void;
};

const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  totalOrders: 0,

  filters: {},
  pollingInterval: null,

  setPage: (page: number) => {
    set({ currentPage: page });
    get().fetchOrders();
  },

  setFilters: (filters: Partial<OrderStore["filters"]>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters },
      currentPage: 1, // Reset to page 1 on filter change
    }));
    get().fetchOrders();
  },

  fetchOrders: async () => {
    set({ loading: true, error: null });
    const { currentPage, filters } = get();
    try {
      const params = {
        page: currentPage,
        limit: 10,
        ...filters,
      };
      const response = await OrderService.getOrders(params);
      const payload = response.payload || response.data?.payload;

      if (payload) {
        set({
          orders: payload.orders || [],
          totalPages: payload.totalPages || 0,
          currentPage: payload.currentPage || 1,
          totalOrders: payload.totalOrders || 0,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message || "Failed to fetch orders" });
      }
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.getOrderById(id);
      const payload = response.payload || response.data?.payload;

      if (payload) {
        set({ currentOrder: payload });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message || "Failed to fetch order details" });
      }
    } finally {
      set({ loading: false });
    }
  },

  updateOrder: async (id: string, orderData: Partial<Order>) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.updateOrder(id, orderData);
      if (response.success || response.status === 200) {
        // Optimistic update or refetch
        get().fetchOrders();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message || "Failed to update order" });
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    const previousOrders = get().orders;

    // Optimistic update
    set((state) => ({
      orders: state.orders.map((o) =>
        String(o._id) === id ? { ...o, status: status as OrderStatus } : o,
      ),
    }));

    try {
      const response = await OrderService.updateOrderStatus(id, status);
      if (!response.success && response.status !== 200) {
        throw new Error("Failed");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Revert on failure
        set({
          orders: previousOrders,
          error: error.message || "Failed to update status",
        });
        toast.error("Failed to update status"); // We need toast here or in component
      }
    }
  },

  bulkUpdateStatus: async (ids: string[], status: string) => {
    set({ loading: true });
    try {
      await OrderService.updateOrdersStatusBulk(ids, status);
      get().fetchOrders(); // Refresh to ensure data consistency
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message || "Bulk update failed" });
      }
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await OrderService.deleteOrder(id);
      get().fetchOrders();
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message || "Failed to delete order" });
      }
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Initialize Socket Listeners
  initSocket: () => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("order_updated", (updatedOrder: Order) => {
      set((state) => {
        // Update list
        const updatedOrders = state.orders.map((o) =>
          o._id === updatedOrder._id ? updatedOrder : o,
        );

        // Update current view if it matches
        const currentOrder =
          state.currentOrder?._id === updatedOrder._id
            ? updatedOrder
            : state.currentOrder;

        return { orders: updatedOrders, currentOrder };
      });
      toast.info(`Order #${updatedOrder.orderNumber} updated`);
    });

    socket.on(
      "orders_bulk_updated",
      ({ orderIds, status }: { orderIds: string[]; status: string }) => {
        set((state) => {
          const typedStatus = status as OrderStatus;
          const updatedOrders = state.orders.map((o) =>
            orderIds.includes(o._id) ? { ...o, status: typedStatus } : o,
          );
          // Update current view if it matches
          const currentOrder =
            state.currentOrder && orderIds.includes(state.currentOrder._id)
              ? { ...state.currentOrder, status: typedStatus }
              : state.currentOrder;

          return { orders: updatedOrders, currentOrder };
        });
        toast.info("Bulk order update received");
      },
    );
  },

  disconnectSocket: () => {
    socket.off("order_updated");
    socket.off("orders_bulk_updated");
    socket.disconnect();
  },

  startPolling: () => {
    const interval = setInterval(() => {
      get().fetchOrders();
    }, 30000); // Poll every 30s
    set({ pollingInterval: interval });
  },

  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval) clearInterval(pollingInterval);
    set({ pollingInterval: null });
  },
}));

export default useOrderStore;
