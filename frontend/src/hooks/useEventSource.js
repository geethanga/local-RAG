import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Custom hook for managing Server-Sent Events (SSE) connections
 * @param {string} url - The URL to connect to
 * @param {Object} options - Configuration options
 * @returns {Object} - EventSource state and methods
 */
export const useEventSource = (url, options = {}) => {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(null)
  const eventSourceRef = useRef(null)
  const { onMessage, onError, onOpen, autoConnect = false } = options

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    try {
      const eventSource = new EventSource(url)
      eventSourceRef.current = eventSource

      eventSource.onopen = () => {
        setIsConnected(true)
        setError(null)
        onOpen?.()
      }

      eventSource.onmessage = (event) => {
        onMessage?.(event)
      }

      eventSource.onerror = (error) => {
        setError(error)
        setIsConnected(false)
        onError?.(error)
      }

    } catch (err) {
      setError(err)
      setIsConnected(false)
    }
  }, [url, onMessage, onError, onOpen])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
      setError(null)
    }
  }, [])

  // Auto-connect if enabled
  useEffect(() => {
    if (autoConnect && url) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, url, connect, disconnect])

  return {
    connect,
    disconnect,
    isConnected,
    error
  }
}
