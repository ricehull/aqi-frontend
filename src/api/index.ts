import axios from 'axios'
import type { User, LoginResponse, AQIData, City } from '../types'

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

export interface LoginResponseWithCities extends LoginResponse {
  supported_cities: City[]
  default_city_aqi?: AQIData
}

export const login = (user: User) => {
  return api.post<LoginResponseWithCities>('/users/login/', user)
}

export const getAQIData = () => {
  return api.get<{ supported_cities: City[], default_city_aqi: AQIData }>('/aqi/')
}

export const getAQIDataByLocation = (site: string) => {
  return api.get<AQIData>(`/aqi/by_site/?site=${site}`)
}

export const getCities = () => {
  return api.get<City[]>('/aqi/cities/')
} 