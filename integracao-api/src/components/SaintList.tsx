import { Link } from 'react-router-dom'
import type { Saint } from '../services/saintsService'

interface SaintListProps {
  saints: Saint[]
}

export function SaintList({ saints }: SaintListProps) {
  return (
    <ul className="saints-list">
      {saints.map((saint) => (
        <li className="saint-card" key={saint.id}>
          <Link className="saint-card-link" to={`/saints/${saint.id}`}>
            <h2>{saint.name}</h2>
            <p>
              <span className="detail-label">Feast day</span>
              {saint.feastDay || saint.date}
            </p>
            {saint.era && (
              <p>
                <span className="detail-label">Era</span>
                {saint.era}
              </p>
            )}
          </Link>
        </li>
      ))}
    </ul>
  )
}
