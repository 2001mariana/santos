import axios from 'axios'

const API_BASE_URL = 'https://acoci86.github.io/daily-saints/api/v1/saints'
const WEBSITE_BASE_URL = 'https://acoci86.github.io/daily-saints'
const DAYS_IN_LEAP_YEAR = 366
const REQUESTS_PER_BATCH = 20

interface ApiSaint {
  name: string
  feast_day?: string | null
  era?: string | null
  patronage?: string[] | null
  legacy?: string | null
  summary?: string | null
  image?: string | null
  wikipedia?: string | null
}

interface DailySaintsResponse {
  feast_day?: string | null
  saints: ApiSaint[]
}

export interface Saint {
  id: string
  name: string
  date: string
  feastDay?: string | null
  era?: string | null
  patronage?: string[] | null
  legacy?: string | null
  summary?: string | null
  image?: string | null
  wikipedia?: string | null
}

export interface SaintsResult {
  saints: Saint[]
  failedEndpoints: string[]
  requestsMade: number
}

let saintsRequest: Promise<SaintsResult> | undefined
const dailyRequests = new Map<string, Promise<DailySaintsResponse>>()

export function getAllSaints(): Promise<SaintsResult> {
  if (!saintsRequest) {
    saintsRequest = loadAllSaints().catch((error: unknown) => {
      saintsRequest = undefined
      throw error
    })
  }

  return saintsRequest
}

export async function getSaintById(id: string): Promise<Saint | undefined> {
  const [date, encodedName, extra] = id.split('~')

  if (!encodedName || extra !== undefined || !getAllDates().includes(date)) {
    return undefined
  }

  const dailyData = await getSaintsForDate(date)
  return dailyData.saints
    .map((saint) => createSaint(saint, dailyData, date))
    .find((saint) => saint.id === id)
}

function getSaintsForDate(date: string): Promise<DailySaintsResponse> {
  let request = dailyRequests.get(date)

  if (!request) {
    request = axios.get<DailySaintsResponse>(`${API_BASE_URL}/${date}.json`)
      .then((response) => response.data)
      .catch((error: unknown) => {
        dailyRequests.delete(date)
        throw error
      })
    dailyRequests.set(date, request)
  }

  return request
}

function createSaint(saint: ApiSaint, dailyData: DailySaintsResponse, date: string): Saint {
  const name = saint.name.trim()
  const nameBytes = new TextEncoder().encode(name)
  const encodedName = btoa(Array.from(nameBytes, (byte) => String.fromCharCode(byte)).join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')

  return {
    id: `${date}~${encodedName}`,
    name,
    date,
    feastDay: saint.feast_day || dailyData.feast_day,
    era: saint.era,
    patronage: saint.patronage,
    legacy: saint.legacy,
    summary: saint.summary,
    image: saint.image ? new URL(saint.image.replace(/^\/+/, ''), `${WEBSITE_BASE_URL}/`).href : null,
    wikipedia: saint.wikipedia,
  }
}

async function loadAllSaints(): Promise<SaintsResult> {
  const dates = getAllDates()
  const saintsByName = new Map<string, Saint>()
  const failedEndpoints: string[] = []

  for (let index = 0; index < dates.length; index += REQUESTS_PER_BATCH) {
    const batch = dates.slice(index, index + REQUESTS_PER_BATCH)
    const responses = await Promise.allSettled(
      batch.map((date) => getSaintsForDate(date)),
    )

    responses.forEach((response, responseIndex) => {
      if (response.status === 'rejected') {
        failedEndpoints.push(batch[responseIndex])
        return
      }

      const dailyData = response.value

      dailyData.saints.forEach((saint) => {
        const name = saint.name.trim()
        const normalizedName = name.toLocaleLowerCase()

        if (!name || saintsByName.has(normalizedName)) return

        saintsByName.set(normalizedName, createSaint(saint, dailyData, batch[responseIndex]))
      })
    })
  }

  const saints = [...saintsByName.values()].sort((first, second) =>
    first.name.localeCompare(second.name),
  )

  return {
    saints,
    failedEndpoints,
    requestsMade: dates.length,
  }
}

function getAllDates(): string[] {
  return Array.from({ length: DAYS_IN_LEAP_YEAR }, (_, index) => {
    const date = new Date(Date.UTC(2024, 0, index + 1))
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const day = String(date.getUTCDate()).padStart(2, '0')

    return `${month}-${day}`
  })
}
