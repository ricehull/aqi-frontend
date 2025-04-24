import axios from 'axios'
import type { User, LoginResponse, AQIData } from '../types'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000
})

// 请求拦截器
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const login = (user: User) => {
  return api.post<LoginResponse>('/users/login/', user)
}

export const getAQIData = () => {
  return api.get<{
    site: string
    station: string
    date: string
    name: string
    aqi: number
    aqi_level: number
    hint_image?: string
  }>('/aqi/')
}

export const getAQIDataByLocation = (site: string) => {
  return api.get<{
    site: string
    station: string
    date: string
    name: string
    aqi: number
    aqi_level: number
    hint_image?: string
  }>(`/aqi/by_site/?site=${site}`)
} 