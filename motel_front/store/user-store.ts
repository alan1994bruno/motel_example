import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserState = {
  email: string | null;
  setEmail: (email: string) => void;
  clear: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      email: null,
      setEmail: (email) => set({ email }),
      clear: () => set({ email: null }),
    }),
    {
      name: "user-storage", // nome da chave no localStorage
    }
  )
);
