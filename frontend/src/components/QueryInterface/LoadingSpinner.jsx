import { clsx } from 'clsx'

/**
 * Loading spinner component
 * @param {Object} props - Component props
 * @param {boolean} props.isVisible - Whether spinner is visible
 * @param {string} props.className - Additional CSS classes
 */
export const LoadingSpinner = ({ isVisible = false, className }) => {
  if (!isVisible) return null

  return (
    <div className={clsx('loading-spinner', className)}>
      <div className="spinner" />
    </div>
  )
}
