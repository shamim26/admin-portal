import { User } from "@/app/interfaces/User";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: User) => set({ user }),
}));

export default useAuthStore;
