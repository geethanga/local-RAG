import { clsx } from 'clsx'

/**
 * Query control buttons component
 * @param {Object} props - Component props
 * @param {Function} props.onStop - Stop query handler
 * @param {Function} props.onClear - Clear all handler
 * @param {boolean} props.isLoading - Whether query is loading
 * @param {boolean} props.canStop - Whether stop button should be enabled
 */
export const QueryControls = ({ 
  onStop, 
  onClear, 
  isLoading = false, 
  canStop = false 
}) => {
  return (
    <div className="query-controls">
      <button
        onClick={onStop}
        disabled={!canStop}
        className={clsx('stop-button', { disabled: !canStop })}
      >
        Stop
      </button>
      <button
        onClick={onClear}
        disabled={isLoading}
        className={clsx('clear-button', { disabled: isLoading })}
      >
        Clear All
      </button>
    </div>
  )
}
