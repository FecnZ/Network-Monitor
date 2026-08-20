import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // Remover ambas clases por seguridad y añadir la correcta
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    
    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}
