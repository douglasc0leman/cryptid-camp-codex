import { useEffect, useRef } from 'react'

export function useScrollToTopOnFiltersChange(filters: Record<string, unknown>) {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    // Delay to let content re-render (important for card list changes)
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)

    return () => clearTimeout(timeout)
  }, [JSON.stringify(filters)]) // JSON.stringify to detect deep changes
}