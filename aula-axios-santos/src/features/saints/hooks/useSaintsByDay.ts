import { useEffect, useState } from "react"
import { getSaintsByDay } from "../services/saints.service"
import type { Saint } from "../types/saint.types"

interface SaintsByDayState {
  saints: Saint[]
  isLoading: boolean
  error: string | null
}

export function useSaintsByDay(): SaintsByDayState {
  const [saints, setSaints] = useState<Saint[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")

    async function loadSaints() {
      try {
        const todaysSaints = await getSaintsByDay(month, day)
        setSaints(todaysSaints)
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load today's saints.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadSaints()
  }, [])

  return { saints, isLoading, error }
}
