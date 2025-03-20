'use client'

import { ReactNode } from "react"
import { useGlobalContext } from "../context/GlobalContext"

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { styles } = useGlobalContext()

  return (
    <body className={`h-full ${styles.background} ${styles.text}`}>
      {children}
    </body>
  )
}