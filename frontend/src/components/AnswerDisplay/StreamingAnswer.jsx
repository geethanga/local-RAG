import { clsx } from 'clsx'

/**
 * Streaming answer display component
 * @param {Object} props - Component props
 * @param {string} props.answer - The answer text
 * @param {boolean} props.isLoading - Whether answer is loading
 * @param {string} props.className - Additional CSS classes
 */
export const StreamingAnswer = ({ 
  answer, 
  isLoading = false, 
  className 
}) => {
  return (
    <div className={clsx('streaming-answer', className)}>
      <h2>Answer</h2>
      <div className={clsx('answer-content', { loading: isLoading })}>
        {answer || (isLoading ? 'Generating answer...' : '')}
      </div>
    </div>
  )
}
