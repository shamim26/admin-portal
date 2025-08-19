import { UserDocument } from "@/app/(auth)/auth.dto";
import { create } from "zustand";

interface AuthStore {
  user: UserDocument | null;
  isGuest: boolean;
  setUser: (user: UserDocument | null) => void;
  setGuest: (isGuest: boolean) => void;
  clearUser: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isGuest: false,
  setUser: (user: UserDocument | null) => set({ user }),
  setGuest: (isGuest: boolean) => set({ isGuest }),
  clearUser: () => set({ user: null, isGuest: false }),
}));

export default useAuthStore;
