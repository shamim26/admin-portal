import { UserDocument } from "@/app/(auth)/auth.dto";
import { create } from "zustand";

interface AuthStore {
  user: UserDocument | null;
  setUser: (user: UserDocument) => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: UserDocument) => set({ user }),
}));

export default useAuthStore;
