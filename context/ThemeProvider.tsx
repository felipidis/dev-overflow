'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface ThemeContextProps {
  mode: string
  setMode: React.Dispatch<React.SetStateAction<string>>
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState('')

  const handleThemeChange = () => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setMode('dark')
      document.documentElement.classList.add('dark')
    } else {
      setMode('light')
      document.documentElement.classList.remove('dark')
    }
  }

  useEffect(() => {
    handleThemeChange()
  }, [mode])

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
