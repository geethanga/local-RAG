import { clsx } from 'clsx'

/**
 * Debug mode toggle component
 * @param {Object} props - Component props
 * @param {boolean} props.isDebugMode - Whether debug mode is enabled
 * @param {Function} props.onToggle - Toggle handler
 * @param {string} props.className - Additional CSS classes
 */
export const DebugToggle = ({ 
  isDebugMode, 
  onToggle, 
  className 
}) => {
  return (
    <div className={clsx('debug-toggle', className)}>
      <input
        type="checkbox"
        id="debugMode"
        checked={isDebugMode}
        onChange={onToggle}
        className="debug-checkbox"
      />
      <label htmlFor="debugMode" className="debug-label">
        Debug Mode
      </label>
    </div>
  )
}
