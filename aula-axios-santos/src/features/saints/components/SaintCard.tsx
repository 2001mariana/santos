import type { Saint } from "../types/saint.types"

interface SaintCardProps {
  saint: Saint
}

function SaintCard({ saint }: SaintCardProps) {
  const imageUrl = saint.image
    ? `https://acoci86.github.io/daily-saints${saint.image}`
    : null

  return (
    <div className="saint-card">
      <h2>{saint.name}</h2>
      <p>Feast Day: {saint.feast_day}</p>
      <p>{saint.era}</p>
      <p>Patronage: {saint.patronage.join(", ")}</p>
      <p>Legacy: {saint.legacy}</p>
      <p>Summary: {saint.summary}</p>
      {imageUrl && <img src={imageUrl} alt={saint.name} />}
    </div>
  )
}

export default SaintCard
