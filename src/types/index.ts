export interface User {
  username: string
  password: string
  userType: string
}

export interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    userType: string
  }
}

export interface City {
  site: string
  name: string
}

export interface AQIData {
  site: string
  station: string
  date: string
  name: string
  aqi: number
  aqi_level: number
  hint_image?: string
}

export interface HealthTip {
  tip: string
  imageUrl?: string
} 