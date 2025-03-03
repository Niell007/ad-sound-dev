"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { debounce } from '@/lib/utils'

export interface SearchableItem {
  id?: string
  title: string
  description?: string
  href: string
  icon?: any
  searchTerms?: string[]
}

interface SearchState {
  isLoading: boolean
  error: Error | null
  recentSearches: SearchableItem[]
}

const MAX_RECENT_SEARCHES = 5
const SEARCH_HISTORY_KEY = 'ad-sound-recent-searches'

export function useSearch(items: SearchableItem[]) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchableItem[]>([])
  const [state, setState] = useState<SearchState>({
    isLoading: false,
    error: null,
    recentSearches: []
  })
  const router = useRouter()

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const savedSearches = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (savedSearches) {
        setState(prev => ({
          ...prev,
          recentSearches: JSON.parse(savedSearches)
        }))
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error)
    }
  }, [])

  // Memoize the search function
  const search = useCallback(
    debounce(async (searchQuery: string) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      try {
        if (!searchQuery.trim()) {
          setResults([])
          return
        }

        const searchResults = items.filter((item) => {
          const searchableText = [
            item.title,
            item.description,
            ...(item.searchTerms || []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()

          const terms = searchQuery.toLowerCase().split(" ")

          return terms.every((term) => searchableText.includes(term))
        })

        setResults(searchResults)
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: error as Error
        }))
      } finally {
        setState(prev => ({ ...prev, isLoading: false }))
      }
    }, 150),
    [items]
  )

  useEffect(() => {
    search(query)
  }, [query, search])

  // Add keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const addToRecentSearches = useCallback((item: SearchableItem) => {
    setState(prev => {
      const newRecentSearches = [
        item,
        ...prev.recentSearches.filter(i => i.href !== item.href)
      ].slice(0, MAX_RECENT_SEARCHES)

      try {
        localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newRecentSearches))
      } catch (error) {
        console.error('Failed to save recent searches:', error)
      }

      return {
        ...prev,
        recentSearches: newRecentSearches
      }
    })
  }, [])

  const onSelect = useCallback((item: SearchableItem) => {
    setIsOpen(false)
    addToRecentSearches(item)
    router.push(item.href)
  }, [router, addToRecentSearches])

  const clearRecentSearches = useCallback(() => {
    setState(prev => ({ ...prev, recentSearches: [] }))
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY)
    } catch (error) {
      console.error('Failed to clear recent searches:', error)
    }
  }, [])

  return {
    isOpen,
    setIsOpen,
    query,
    setQuery,
    results,
    onSelect,
    isLoading: state.isLoading,
    error: state.error,
    recentSearches: state.recentSearches,
    clearRecentSearches
  }
} 