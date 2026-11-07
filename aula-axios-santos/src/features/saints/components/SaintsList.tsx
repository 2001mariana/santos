import type { Saint } from "../types/saint.types"
import SaintCard from "./SaintCard"

interface SaintsListProps {
  saints: Saint[]
}

function SaintsList({ saints }: SaintsListProps) {
  return (
    <div className="saints-list">
      {saints.map((saint) => (
        <SaintCard key={saint.name} saint={saint} />
      ))}
    </div>
  )
}

export default SaintsList
