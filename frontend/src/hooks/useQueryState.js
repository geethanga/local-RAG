import { useState, useCallback } from 'react'

/**
 * Custom hook for managing query state and operations
 * @returns {Object} - Query state and methods
 */
export const useQueryState = () => {
  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState('')
  const [sources, setSources] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const startQuery = useCallback((queryText) => {
    setQuery(queryText)
    setAnswer('')
    setSources([])
    setError(null)
    setIsLoading(true)
  }, [])

  const updateAnswer = useCallback((newContent) => {
    setAnswer(prev => prev + newContent)
  }, [])

  const setSourcesData = useCallback((sourcesData) => {
    setSources(sourcesData)
    setIsLoading(false)
  }, [])

  const setErrorState = useCallback((errorMessage) => {
    setError(errorMessage)
    setIsLoading(false)
  }, [])

  const stopQuery = useCallback(() => {
    setIsLoading(false)
  }, [])

  const clearAll = useCallback(() => {
    setQuery('')
    setAnswer('')
    setSources([])
    setError(null)
    setIsLoading(false)
  }, [])

  return {
    // State
    query,
    answer,
    sources,
    isLoading,
    error,
    
    // Actions
    startQuery,
    updateAnswer,
    setSourcesData,
    setErrorState,
    stopQuery,
    clearAll
  }
}
