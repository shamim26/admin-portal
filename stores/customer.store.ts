import { create } from "zustand";
import { CustomerService } from "@/app/(private)/customers/customer.service";
import { Customer } from "@/app/(private)/customers/customer.dto";
import { toast } from "sonner";

interface CustomerFilters {
  search?: string;
  role?: string;
  status?: string;
}

interface CustomerStore {
  customers: Customer[];
  loading: boolean;
  totalCustomers: number;
  currentPage: number;
  totalPages: number;
  filters: CustomerFilters;
  
  setFilters: (filters: Partial<CustomerFilters>) => void;
  setPage: (page: number) => void;
  fetchCustomers: () => Promise<void>;
  
  banCustomer: (id: string) => Promise<boolean>;
  unbanCustomer: (id: string) => Promise<boolean>;
  updateRole: (id: string, role: string) => Promise<boolean>;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customers: [],
  loading: false,
  totalCustomers: 0,
  currentPage: 1,
  totalPages: 1,
  filters: {
    status: "all",
    role: "all",
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1, // reset page on filter change
    }));
    get().fetchCustomers();
  },

  setPage: (page) => {
    set({ currentPage: page });
    get().fetchCustomers();
  },

  fetchCustomers: async () => {
    const { currentPage, filters } = get();
    set({ loading: true });
    try {
      const data = await CustomerService.getCustomers({
        page: currentPage,
        search: filters.search,
        status: filters.status,
        role: filters.role,
      });

      if (data.success) {
        set({
          customers: data.payload.users || [],
          totalPages: data.payload.totalPages || 1,
          totalCustomers: data.payload.totalUsers || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch customers", error);
      toast.error("Failed to load users");
    } finally {
      set({ loading: false });
    }
  },

  banCustomer: async (id: string) => {
    try {
      const res = await CustomerService.banCustomer(id);
      if (res.success) {
        set((state) => ({
          customers: state.customers.map((c) =>
            c._id === id ? { ...c, isBanned: true } : c
          ),
        }));
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  },

  unbanCustomer: async (id: string) => {
    try {
      const res = await CustomerService.unbanCustomer(id);
      if (res.success) {
        set((state) => ({
          customers: state.customers.map((c) =>
            c._id === id ? { ...c, isBanned: false } : c
          ),
        }));
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  },

  updateRole: async (id: string, role: string) => {
    try {
      const res = await CustomerService.updateRole(id, role);
      if (res.success) {
        set((state) => ({
          customers: state.customers.map((c) =>
            c._id === id ? { ...c, role } : c
          ),
        }));
        return true;
      }
    } catch (error) {
      console.error(error);
    }
    return false;
  },
}));
