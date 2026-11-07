import { useEffect, useState } from 'react'
import { SaintList } from './SaintList'
import { getAllSaints, type Saint, type SaintsResult } from '../services/saintsService'

export function SaintsPage() {
  const [saints, setSaints] = useState<Saint[]>([])
  const [failedEndpoints, setFailedEndpoints] = useState<string[]>([])
  const [requestsMade, setRequestsMade] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    getAllSaints()
      .then((result: SaintsResult) => {
        if (!isMounted) return

        setSaints(result.saints)
        setFailedEndpoints(result.failedEndpoints)
        setRequestsMade(result.requestsMade)
      })
      .catch(() => {
        if (!isMounted) return

        setError('We could not load the saints. Please try again later.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const hasResults = saints.length > 0

  return (
    <main className="page-shell">
      <header className="page-header">
        <p className="eyebrow">The Catholic calendar</p>
        <h1>All Catholic Saints</h1>
      </header>

      <section className="saints-section" aria-label="All Catholic saints">
        {isLoading && (
          <p className="status-message" role="status">
            <span className="loading-indicator" aria-hidden="true" />
            Loading saints from all 366 days...
          </p>
        )}

        {error && <p className="status-message error-message" role="alert">{error}</p>}

        {!isLoading && !error && !hasResults && failedEndpoints.length === 0 && (
          <p className="status-message">No saints were found.</p>
        )}

        {!isLoading && !error && hasResults && (
          <>
            <div className="results-summary">
              <p>
                <strong>{saints.length.toLocaleString()}</strong>
                {saints.length === 1 ? ' saint found' : ' saints found'}
              </p>
              <p>{requestsMade} daily requests completed</p>
            </div>

            {failedEndpoints.length > 0 && (
              <p className="partial-results-message" role="status">
                Some dates could not be loaded. The list includes all saints returned by the
                available dates.
              </p>
            )}

            <SaintList saints={saints} />
          </>
        )}

        {!isLoading && !error && !hasResults && failedEndpoints.length > 0 && (
          <p className="status-message error-message" role="alert">
            We could not load any saints. Please try again later.
          </p>
        )}

        {!isLoading && failedEndpoints.length > 0 && (
          <details className="failed-endpoints">
            <summary>{failedEndpoints.length} daily endpoints failed</summary>
            <ul>
              {failedEndpoints.map((endpoint) => (
                <li key={endpoint}>{endpoint}</li>
              ))}
            </ul>
          </details>
        )}
      </section>
    </main>
  )
}
