import { create } from 'zustand'

export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("SyncChat-theme") || "aqua",
    setTheme: (theme) => {
        set({ theme })
        localStorage.setItem("SyncChat-theme", theme)
    }
}))