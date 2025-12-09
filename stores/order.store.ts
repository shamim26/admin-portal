import { Order } from "@/app/(private)/orders/order.dto";
import { OrderService } from "@/app/(private)/orders/order.service";
import { create } from "zustand";

type OrderStore = {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;

  // Pagination State
  totalPages: number;
  currentPage: number;
  totalOrders: number;

  // Actions
  fetchOrders: () => Promise<void>;
  fetchOrderById: (id: string) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  // State setters
  setPage: (page: number) => void;
};

const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  totalOrders: 0,

  setPage: (page: number) => set({ currentPage: page }),

  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.getOrders();
      const payload = response.payload || response.data?.payload; // Handle potential response structure variations

      if (payload) {
        set({
          orders: payload.orders || [],
          totalPages: payload.totalPages || 0,
          currentPage: payload.currentPage || 1,
          totalOrders: payload.totalOrders || 0,
        });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch orders" });
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
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch order details" });
    } finally {
      set({ loading: false });
    }
  },

  updateOrder: async (id: string, orderData: Partial<Order>) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.updateOrder(id, orderData);
      if (response.success || response.status === 200) {
        set((state) => ({
          orders: state.orders.map((o) =>
            // Ensure ID comparison works (string vs number handling if needed)
            String(o.id) === id ? { ...o, ...orderData } : o
          ),
          currentOrder:
            state.currentOrder && String(state.currentOrder.id) === id
              ? { ...state.currentOrder, ...orderData }
              : state.currentOrder,
        }));
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to update order" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.updateOrderStatus(id, status);
      if (response.success || response.status === 200) {
        // Update local state to reflect the change immediately
        set((state) => ({
          orders: state.orders.map((o) =>
            String(o.id) === id ? { ...o, status: status as any } : o
          ),
          currentOrder:
            state.currentOrder && String(state.currentOrder.id) === id
              ? { ...state.currentOrder, status: status as any }
              : state.currentOrder,
        }));
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to update order status" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteOrder: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const response = await OrderService.deleteOrder(id);
      if (response.success || response.status === 200) {
        set((state) => ({
          orders: state.orders.filter((o) => String(o.id) !== id),
          currentOrder:
            state.currentOrder && String(state.currentOrder.id) === id
              ? null
              : state.currentOrder,
        }));
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to delete order" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));

export default useOrderStore;
