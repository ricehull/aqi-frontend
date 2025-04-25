import { defineStore } from 'pinia'
import type { AQIData, User, City } from '../types'
import { getAQIData, getAQIDataByLocation } from '../api'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token')
  }),
  
  actions: {
    setUser(user: User) {
      this.user = user
    },
    setToken(token: string) {
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})

export const useAQIStore = defineStore('aqi', {
  state: () => ({
    cities: [] as City[],
    currentCity: null as City | null,
    aqiData: null as AQIData | null,
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchCitiesAndDefaultAQI() {
      this.loading = true
      this.error = null
      try {
        const response = await getAQIData()
        this.cities = response.data.supported_cities
        if (response.data.default_city_aqi) {
          this.aqiData = response.data.default_city_aqi
          this.currentCity = this.cities.find(city => city.site === this.aqiData?.site) || null
        }
      } catch (error) {
        this.error = '获取数据失败'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchAQIDataByCity(site: string) {
      this.loading = true
      this.error = null
      try {
        const response = await getAQIDataByLocation(site)
        this.aqiData = response.data
        this.currentCity = this.cities.find(city => city.site === site) || null
      } catch (error) {
        this.error = '获取数据失败'
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    
    setCurrentCity(city: City) {
      this.currentCity = city
      this.fetchAQIDataByCity(city.site)
    }
  }
}) 