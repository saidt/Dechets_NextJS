'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function NavigationHistory() {
  const pathname = usePathname()

  useEffect(() => {
    const prev = sessionStorage.getItem('currentUrl')
    if (prev) {
      sessionStorage.setItem('previousUrl', prev)
    }
    sessionStorage.setItem('currentUrl', pathname)
  }, [pathname])

  return null
}