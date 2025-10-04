import { useState, useCallback } from 'react'

/**
 * Custom hook for managing debug mode state and logging
 * @returns {Object} - Debug state and methods
 */
export const useDebugMode = () => {
  const [isDebugMode, setIsDebugMode] = useState(false)
  const [debugLogs, setDebugLogs] = useState([])

  const toggleDebugMode = useCallback(() => {
    setIsDebugMode(prev => !prev)
  }, [])

  const addLog = useCallback((message) => {
    const timestamp = new Date().toISOString()
    const logEntry = `${timestamp}: ${message}`
    
    setDebugLogs(prev => [...prev, logEntry])
  }, [])

  const clearLogs = useCallback(() => {
    setDebugLogs([])
  }, [])

  return {
    isDebugMode,
    debugLogs,
    toggleDebugMode,
    addLog,
    clearLogs
  }
}
