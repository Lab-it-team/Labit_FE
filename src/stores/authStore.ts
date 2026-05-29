import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  nickname: string
  profileImageUrl: string | null
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserProfile | null
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: UserProfile) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      clearAuth: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'auth',
      partialize: (state) => ({ refreshToken: state.refreshToken, user: state.user }),
    },
  ),
)
