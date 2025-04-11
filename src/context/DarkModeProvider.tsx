import { createContext } from 'react'

interface DarkModeContextType {
    darkModeEnabled: boolean;
    darkModeToggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

import { useEffect, useState } from 'react'

interface DarkModeProviderProps {
    children: React.ReactNode;
}

export default function DarkModeProvider({ children }: DarkModeProviderProps) {
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        const isDark = saved === 'dark' || (!saved && prefersDark)
        devLog("isDark", isDark)

        document.documentElement.classList.toggle('dark', isDark)
        setDarkModeEnabled(isDark)
    }, [darkModeEnabled])

    const darkModeToggle = () => {
        const newVal = !darkModeEnabled
        document.documentElement.classList.toggle('dark', newVal)
        localStorage.setItem('theme', newVal ? 'dark' : 'light')
        setDarkModeEnabled(newVal)
    }

    return (
        <DarkModeContext.Provider value={{ darkModeEnabled, darkModeToggle }}>
            {children}
        </DarkModeContext.Provider>
    )
}

import { useContext } from 'react'
import { devLog } from '../utils';

export function useDarkMode() {
    const context = useContext(DarkModeContext)
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider')
    }
    return context
}
