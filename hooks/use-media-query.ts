"use client"

import { useState, useEffect } from "react"

type MediaQueryObject = {
  [key: string]: string
}

const defaultBreakpoints = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
}

export function useMediaQuery(query: string): boolean
export function useMediaQuery(queries: MediaQueryObject): Record<string, boolean>
export function useMediaQuery(
  queryOrQueries: string | MediaQueryObject,
  customBreakpoints: MediaQueryObject = defaultBreakpoints
) {
  const [matches, setMatches] = useState<boolean | Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return typeof queryOrQueries === "string" ? false : {}
    }

    if (typeof queryOrQueries === "string") {
      return window.matchMedia(queryOrQueries).matches
    }

    const initialMatches: Record<string, boolean> = {}
    Object.entries(queryOrQueries).forEach(([key, query]) => {
      initialMatches[key] = window.matchMedia(query).matches
    })
    return initialMatches
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateMatches = () => {
      if (typeof queryOrQueries === "string") {
        setMatches(window.matchMedia(queryOrQueries).matches)
        return
      }

      const newMatches: Record<string, boolean> = {}
      Object.entries(queryOrQueries).forEach(([key, query]) => {
        newMatches[key] = window.matchMedia(query).matches
      })
      setMatches(newMatches)
    }

    updateMatches()

    const mediaQueryLists = typeof queryOrQueries === "string"
      ? [window.matchMedia(queryOrQueries)]
      : Object.values(queryOrQueries).map((q) => window.matchMedia(q))

    const listeners = mediaQueryLists.map((mql) => {
      const listener = () => updateMatches()
      mql.addListener(listener)
      return { mql, listener }
    })

    return () => {
      listeners.forEach(({ mql, listener }) => {
        mql.removeListener(listener)
      })
    }
  }, [queryOrQueries])

  return matches
}

// Helper functions
export function isMobile(): boolean {
  return useMediaQuery("(max-width: 639px)")
}

export function isTablet(): boolean {
  return useMediaQuery("(min-width: 640px) and (max-width: 1023px)")
}

export function isDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)")
}

export function useBreakpoints() {
  return useMediaQuery(defaultBreakpoints)
} 