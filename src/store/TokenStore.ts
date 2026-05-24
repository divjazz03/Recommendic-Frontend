import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TokenContext = {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
};

export const useTokenStore = create<TokenContext>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (token) => set({ accessToken: token }),
      refreshToken: null,
      setRefreshToken: (token) => set({ refreshToken: token }),
    }),
    {
      name: "token-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
