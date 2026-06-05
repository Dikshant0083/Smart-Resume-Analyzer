import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  isDark: false,

  setIsDark: (isDark) => set({ isDark }),
  toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
}))