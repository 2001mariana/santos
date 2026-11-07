export interface Saint {
  name: string
  feast_day: string
  era: string
  patronage: string[]
  legacy: string
  summary: string
  image?: string
  wikipedia: string
}

export interface SaintsResponse {
  date: string
  feast_day: string
  count: number
  saints: Saint[]
}
