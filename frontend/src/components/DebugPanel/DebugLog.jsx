import { clsx } from 'clsx'

/**
 * Debug log display component
 * @param {Object} props - Component props
 * @param {Array} props.logs - Array of log messages
 * @param {boolean} props.isVisible - Whether logs are visible
 * @param {string} props.className - Additional CSS classes
 */
export const DebugLog = ({ 
  logs = [], 
  isVisible = false, 
  className 
}) => {
  if (!isVisible || !logs.length) return null

  return (
    <div className={clsx('debug-log', className)}>
      <h3>Debug Log</h3>
      <pre className="debug-content">
        {logs.join('\n')}
      </pre>
    </div>
  )
}
