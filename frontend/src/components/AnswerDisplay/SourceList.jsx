import { clsx } from 'clsx'

/**
 * Source list component for displaying source references
 * @param {Object} props - Component props
 * @param {Array} props.sources - Array of source objects
 * @param {string} props.className - Additional CSS classes
 */
export const SourceList = ({ sources = [], className }) => {
  if (!sources.length) return null

  return (
    <div className={clsx('source-list', className)}>
      <h2>Sources</h2>
      <div className="sources-container">
        {sources.map((source, index) => (
          <div key={index} className="source-item">
            <strong>Source {index + 1}</strong>
            <p className="source-text">{source.text}</p>
            <div className="source-metadata">
              <small>File: {source.metadata?.filename || 'Unknown'}</small>
              {source.metadata?.pageCount && (
                <small>Page: {source.metadata.chunkIndex + 1}</small>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
