import { create } from "zustand";
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark';

type DarkModeStore = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}


export const useDarkMode = create<DarkModeStore>()(
    persist(
        (set) => ({
            theme: 'light',
            setTheme: (theme: Theme) => set({ theme }),
            toggleTheme: () =>
                set((state) => ({
                    theme: state.theme === 'dark' ? 'light' : 'dark'
                }))
        }),
        {
            name: 'theme'
        }
    )
)