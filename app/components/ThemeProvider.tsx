'use client'

import { ReactNode } from "react"
import { useThemeContext } from "../context/GlobalContext"

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { styles } = useThemeContext()

  return (
    <body className={`h-full ${styles.background} ${styles.text}`}>
      {children}
    </body>
  )
}
