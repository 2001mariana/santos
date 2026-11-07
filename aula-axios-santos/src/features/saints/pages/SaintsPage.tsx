import SaintsList from "../components/SaintsList"
import { useSaintsByDay } from "../hooks/useSaintsByDay"

function SaintsPage() {
  const { saints, isLoading, error } = useSaintsByDay()

  return (
    <main className="saints-page">
      <h1>Saints of the Day</h1>
      {isLoading && <p role="status">Loading saints...</p>}
      {error && <p role="alert">Unable to load saints: {error}</p>}
      {!isLoading && !error && saints.length === 0 && (
        <p>No saints found for today.</p>
      )}
      {!isLoading && !error && saints.length > 0 && (
        <SaintsList saints={saints} />
      )}
    </main>
  )
}

export default SaintsPage
