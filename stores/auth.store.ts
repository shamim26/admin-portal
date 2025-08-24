import { UserDocument } from "@/app/(auth)/auth.dto";
import { AuthService } from "@/app/(auth)/auth.service";
import { MWResponseType } from "@/services/apiClient";
import { create } from "zustand";

interface AuthStore {
  user: UserDocument | null;
  isGuest: boolean;
  setGuest: (isGuest: boolean) => void;
  clearUser: () => void;
  login: (email: string, password: string) => Promise<MWResponseType>;
  getUser: () => Promise<MWResponseType>;
  guestLogin: () => Promise<MWResponseType>;
  logout: () => void;
}

const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isGuest: false,
  setGuest: (isGuest: boolean) => set({ isGuest }),
  clearUser: () => set({ user: null, isGuest: false }),
  login: async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    if (response.data.success) {
      set({ user: response.data.payload.user });
    }
    return response.data;
  },
  getUser: async () => {
    const response = await AuthService.getUser();
    if (response.data.success) {
      set({ user: response.data.payload.user });
    } else {
      // Clear user if API call fails (invalid/expired cookies)
      set({ user: null });
    }
    return response.data;
  },
  guestLogin: async () => {
    const response = await AuthService.guestLogin();
    if (response.data.success) {
      set({ user: response.data.payload.user });
    }
    return response.data;
  },
  logout: async () => {
    const response = await AuthService.logout();
    if (response.data.success) {
      set({ user: null, isGuest: false });
    }
    return response.data;
  },
}));

export default useAuthStore;
