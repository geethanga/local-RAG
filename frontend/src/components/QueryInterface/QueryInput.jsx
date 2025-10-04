import { useState } from 'react'
import { clsx } from 'clsx'

/**
 * Query input component with textarea and submit button
 * @param {Object} props - Component props
 * @param {string} props.value - Current query value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onSubmit - Submit handler
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {string} props.placeholder - Placeholder text
 */
export const QueryInput = ({ 
  value, 
  onChange, 
  onSubmit, 
  disabled = false, 
  placeholder = "Enter your query here..." 
}) => {
  const [localValue, setLocalValue] = useState(value || '')

  const handleChange = (e) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange?.(newValue)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (localValue.trim() && !disabled) {
      onSubmit?.(localValue.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="query-input-form">
      <textarea
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={clsx('query-textarea', { disabled })}
        rows={4}
      />
      <button
        type="submit"
        disabled={disabled || !localValue.trim()}
        className={clsx('submit-button', { disabled })}
      >
        Submit Query
      </button>
    </form>
  )
}
