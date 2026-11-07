import axios from "axios"
import type { Saint, SaintsResponse } from "../types/saint.types"

const DAILY_SAINTS_BASE_URL = "https://acoci86.github.io/daily-saints"

export async function getSaintsByDay(
  month: string,
  day: string,
): Promise<Saint[]> {
  const url = `${DAILY_SAINTS_BASE_URL}/api/v1/saints/${month}-${day}.json`
  const { data } = await axios.get<SaintsResponse>(url)

  return data.saints
}
