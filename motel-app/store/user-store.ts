import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "./storage";

interface UserState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  setToken: (token: string, email: string) => void;
  clear: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      email: null,
      isAuthenticated: false,
      hasHydrated: false,

      setToken: (token, email) => {
        set({ token, email, isAuthenticated: true });
      },

      clear: () => {
        set({ token: null, email: null, isAuthenticated: false });
      },

      setHasHydrated: (state) => {
        set({ hasHydrated: state });
      },
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        // Quando terminar de ler o SecureStore, avisa que hidratou
        state?.setHasHydrated(true);
      },
    },
  ),
);
