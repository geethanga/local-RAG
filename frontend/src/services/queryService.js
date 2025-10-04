/**
 * Service for handling query-related API calls
 */

/**
 * Creates a query URL with proper encoding
 * @param {string} query - The query string
 * @returns {string} - The encoded query URL
 */
export const createQueryUrl = (query) => {
  return `/query?query=${encodeURIComponent(query)}`
}

/**
 * Handles Server-Sent Events for streaming queries
 * @param {string} query - The query string
 * @param {Object} callbacks - Event callbacks
 * @returns {EventSource} - The EventSource instance
 */
export const createQueryStream = (query, callbacks = {}) => {
  const { onMessage, onError, onOpen } = callbacks
  const url = createQueryUrl(query)
  
  const eventSource = new EventSource(url)
  
  eventSource.onopen = () => {
    onOpen?.()
  }
  
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage?.(data)
    } catch (error) {
      console.error('Error parsing SSE message:', error)
      onError?.(error)
    }
  }
  
  eventSource.onerror = (error) => {
    onError?.(error)
  }
  
  return eventSource
}

/**
 * Processes different types of SSE messages
 * @param {Object} data - The parsed message data
 * @param {Object} handlers - Message handlers
 */
export const handleSSEMessage = (data, handlers = {}) => {
  const { onAnswer, onSources, onError } = handlers
  
  switch (data.type) {
    case 'answer':
      onAnswer?.(data.content)
      break
    case 'sources':
      onSources?.(data.content)
      break
    case 'error':
      onError?.(data.content)
      break
    default:
      console.warn('Unknown message type:', data.type)
  }
}
