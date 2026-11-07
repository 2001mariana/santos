import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getSaintById, type Saint } from '../services/saintsService'

type DetailsState =
  | { status: 'loading' }
  | { status: 'found'; saint: Saint }
  | { status: 'not-found' }
  | { status: 'error' }

export function SaintDetails() {
  const { saintId = '' } = useParams()
  return <SaintDetailsPage key={saintId} saintId={saintId} />
}

function SaintDetailsPage({ saintId }: { saintId: string }) {
  const [state, setState] = useState<DetailsState>({ status: 'loading' })

  useEffect(() => {
    let active = true

    getSaintById(saintId)
      .then((saint) => {
        if (!active) return
        setState(saint ? { status: 'found', saint } : { status: 'not-found' })
      })
      .catch(() => {
        if (active) setState({ status: 'error' })
      })

    return () => {
      active = false
    }
  }, [saintId])

  return (
    <main className="page-shell">
      <Link className="back-link" to="/">← Back to all saints</Link>

      {state.status === 'loading' && (
        <p className="status-message" role="status">
          <span className="loading-indicator" aria-hidden="true" />
          Loading saint details...
        </p>
      )}

      {state.status === 'error' && (
        <p className="status-message error-message" role="alert">
          We could not load this saint. Please try again later.
        </p>
      )}

      {state.status === 'not-found' && (
        <p className="status-message">Saint not found.</p>
      )}

      {state.status === 'found' && <SaintProfile saint={state.saint} />}
    </main>
  )
}

function SaintProfile({ saint }: { saint: Saint }) {
  return (
    <article className="saint-profile">
      <header className="page-header">
        <p className="eyebrow">The Catholic calendar</p>
        <h1>{saint.name}</h1>
      </header>

      <div className="profile-content">
        {saint.image && <img className="saint-image" src={saint.image} alt={saint.name} />}
        <div className="profile-details">
          <dl className="profile-facts">
            {saint.feastDay && <div><dt>Feast day</dt><dd>{saint.feastDay}</dd></div>}
            {saint.era && <div><dt>Era</dt><dd>{saint.era}</dd></div>}
            {saint.patronage && saint.patronage.length > 0 && (
              <div><dt>Patronage</dt><dd>{saint.patronage.join(', ')}</dd></div>
            )}
          </dl>
          {saint.summary && <section><h2>Summary</h2><p>{saint.summary}</p></section>}
          {saint.legacy && <section><h2>Legacy</h2><p>{saint.legacy}</p></section>}
        </div>
      </div>
    </article>
  )
}
