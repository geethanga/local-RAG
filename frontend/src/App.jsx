import { useCallback, useEffect, useRef } from 'react'
import { AppLayout } from './components/Layout'
import { QueryInput, QueryControls, LoadingSpinner } from './components/QueryInterface'
import { StreamingAnswer, SourceList, ErrorMessage } from './components/AnswerDisplay'
import { DebugToggle, DebugLog } from './components/DebugPanel'
import { useQueryState } from './hooks/useQueryState'
import { useDebugMode } from './hooks/useDebugMode'
import { useEventSource } from './hooks/useEventSource'
import { createQueryStream, handleSSEMessage } from './services/queryService'
import './App.css'

function App() {
  const eventSourceRef = useRef(null)
  
  const {
    query,
    answer,
    sources,
    isLoading,
    error,
    startQuery,
    updateAnswer,
    setSourcesData,
    setErrorState,
    stopQuery,
    clearAll
  } = useQueryState()

  const {
    isDebugMode,
    debugLogs,
    toggleDebugMode,
    addLog,
    clearLogs
  } = useDebugMode()

  const handleQuerySubmit = useCallback((queryText) => {
    // Clean up any existing connection first
    if (eventSourceRef.current) {
      addLog('Closing existing connection')
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    addLog(`Starting query: ${queryText}`)
    startQuery(queryText)
    
    const eventSource = createQueryStream(queryText, {
      onOpen: () => {
        addLog('Connection opened')
      },
      onMessage: (data) => {
        addLog(`Received message: ${JSON.stringify(data)}`)
        handleSSEMessage(data, {
          onAnswer: (content) => {
            // Filter out source information from answer content
            const filteredContent = content
              .split('\n')
              .filter(line => {
                const trimmed = line.trim()
                return !trimmed.startsWith('Source:') &&
                       !trimmed.match(/^\[\d+\]/) &&
                       !trimmed.includes('Source:')
              })
              .join('\n')
            
            if (filteredContent.trim()) {
              updateAnswer(filteredContent)
            }
          },
          onSources: (sourcesData) => {
            setSourcesData(sourcesData)
            // Close the connection when sources are received
            if (eventSourceRef.current) {
              addLog('Query completed, closing connection')
              eventSourceRef.current.close()
              eventSourceRef.current = null
            }
            stopQuery()
          },
          onError: (errorMessage) => {
            setErrorState(errorMessage)
            // Close the connection on error
            if (eventSourceRef.current) {
              addLog('Error occurred, closing connection')
              eventSourceRef.current.close()
              eventSourceRef.current = null
            }
            stopQuery()
          }
        })
      },
      onError: (err) => {
        addLog(`EventSource error: ${JSON.stringify(err)}`)
        if (err.target?.readyState === EventSource.CLOSED) {
          setErrorState('Connection error. Please try again.')
          eventSourceRef.current = null
          stopQuery()
        }
      }
    })

    // Store eventSource reference for cleanup
    eventSourceRef.current = eventSource
  }, [startQuery, updateAnswer, setSourcesData, setErrorState, stopQuery, addLog])

  const handleStopQuery = useCallback(() => {
    addLog('Stopping query')
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      addLog('Connection closed')
    }
    stopQuery()
  }, [stopQuery, addLog])

  const handleClearAll = useCallback(() => {
    handleStopQuery()
    clearAll()
    clearLogs()
  }, [handleStopQuery, clearAll, clearLogs])

  // Cleanup effect to close connections when component unmounts
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [])

  return (
    <AppLayout>
      <div className="app-container">
        <div className="input-section">
          <h2>Query</h2>
          <QueryInput
            value={query}
            onChange={() => {}} // Controlled by the form
            onSubmit={handleQuerySubmit}
            disabled={isLoading}
          />
          <QueryControls
            onStop={handleStopQuery}
            onClear={handleClearAll}
            isLoading={isLoading}
            canStop={isLoading}
          />
          <LoadingSpinner isVisible={isLoading} />
          <DebugToggle
            isDebugMode={isDebugMode}
            onToggle={toggleDebugMode}
          />
        </div>
        
        <div className="output-section">
          <ErrorMessage error={error} />
          <StreamingAnswer answer={answer} isLoading={isLoading} />
          <SourceList sources={sources} />
        </div>
      </div>
      
      <DebugLog logs={debugLogs} isVisible={isDebugMode} />
    </AppLayout>
  )
}

export default App
