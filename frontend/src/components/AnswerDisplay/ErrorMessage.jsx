import { clsx } from 'clsx'

/**
 * Error message component
 * @param {Object} props - Component props
 * @param {string} props.error - Error message
 * @param {string} props.className - Additional CSS classes
 */
export const ErrorMessage = ({ error, className }) => {
  if (!error) return null

  return (
    <div className={clsx('error-message', className)}>
      <div className="error-content">
        <strong>Error:</strong> {error}
      </div>
    </div>
  )
}
