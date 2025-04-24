import { defineStore } from 'pinia'
import type { AQIData, User } from '../types'
import { getAQIData } from '../api'

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
    aqiData: [] as AQIData[],
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchAQIData() {
      this.loading = true
      this.error = null
      try {
        const response = await getAQIData()
        this.aqiData = response.data
      } catch (error) {
        this.error = '获取数据失败'
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}) 