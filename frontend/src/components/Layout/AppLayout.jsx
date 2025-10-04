import { clsx } from 'clsx'

/**
 * Main layout component for the RAG application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @param {string} props.className - Additional CSS classes
 */
export const AppLayout = ({ children, className }) => {
  return (
    <div className={clsx('app-layout', className)}>
      <header className="app-header">
        <h1>RAG Local - Query Test</h1>
      </header>
      <main className="app-main">
        {children}
      </main>
    </div>
  )
}
