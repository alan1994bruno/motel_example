import { create } from "zustand";
import { persist } from "zustand/middleware";

type ForgotState = {
  email: string;
  setEmail: (email: string) => void;
  clear: () => void;
};

export const useForgotStore = create<ForgotState>()(
  persist(
    (set) => ({
      email: "",
      setEmail: (email) => set({ email }),
      clear: () => set({ email: "" }),
    }),
    {
      name: "forgot-storage", // nome da chave no localStorage
    }
  )
);
