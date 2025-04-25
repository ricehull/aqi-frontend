<template>
  <div class="home">
    <h2>Air Quality Forecast System</h2>
    <div class="content">
      <div v-if="loading">Loading...</div>
      <div v-else-if="error">{{ error }}</div>
      <template v-else>
        <div class="welcome" v-if="username">
          <h3>Welcome back, {{ username }}</h3>
        </div>
        
        <!-- 城市选择器 -->
        <div class="city-selector">
          <label for="city-select">Select City:</label>
          <select id="city-select" v-model="selectedCity" @change="handleCityChange">
            <option v-for="city in cities" :key="city.site" :value="city">
              {{ city.name }}
            </option>
          </select>
        </div>
        
        <div class="aqi-container">
          <!-- 空气质量卡片 -->
          <div v-if="aqiData" class="aqi-item">
            <h3>{{ aqiData.name }}</h3>
            <div class="aqi-value" :class="getAQIClass(aqiData.aqi)">
              AQI: {{ aqiData.aqi }}
            </div>
            <div class="aqi-details">
              <p><strong>Date:</strong> {{ formatDate(aqiData.date) }}</p>
            </div>
            <div class="health-tip">
              <p>{{ getHealthTip(aqiData.aqi_level) }}</p>
              <!-- 只有在图片存在时才显示 -->
              <div v-if="aqiData.hint_image" class="image-container">
                <img :src="getImageSrc(aqiData.hint_image)" alt="Health Tip Image" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <button @click="handleLogout" class="logout-btn">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAQIStore } from '../store'
import { useUserStore } from '../store'
import type { City } from '../types'

const router = useRouter()
const aqiStore = useAQIStore()
const userStore = useUserStore()

const selectedCity = ref<City | null>(null)
const username = computed(() => userStore.user?.username || '')
const aqiData = computed(() => aqiStore.aqiData)
const cities = computed(() => aqiStore.cities)
const loading = computed(() => aqiStore.loading)
const error = computed(() => aqiStore.error)

onMounted(async () => {
  // 确保用户已登录
  if (!userStore.token) {
    router.push('/')
    return
  }
  
  // 获取 AQI 数据
  await aqiStore.fetchCitiesAndDefaultAQI()
  if (aqiStore.currentCity) {
    selectedCity.value = aqiStore.currentCity
  }
})

const handleCityChange = () => {
  if (selectedCity.value) {
    aqiStore.fetchAQIDataByCity(selectedCity.value.site)
  }
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US')
}

const getAQIClass = (aqi: number) => {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy-sensitive'
  if (aqi <= 200) return 'unhealthy'
  if (aqi <= 300) return 'very-unhealthy'
  return 'hazardous'
}

const getHealthTip = (aqiLevel: number) => {
  const tips: Record<number, string> = {
    1: 'Excellent air quality. Perfect for outdoor activities.',
    2: 'Good air quality. Suitable for outdoor activities.',
    3: 'Moderate pollution. Sensitive individuals should reduce outdoor activities.',
    4: 'Unhealthy air quality. Reduce outdoor activities.',
    5: 'Very unhealthy air quality. Avoid outdoor activities.',
    6: 'Hazardous air quality. Stay indoors.'
  }
  return tips[aqiLevel] || 'Unknown air quality'
}

const getImageSrc = (base64String: string) => {
  // 检查字符串是否已经包含 data:image 前缀
  if (base64String.startsWith('data:image')) {
    return base64String
  }
  // 否则添加正确的前缀
  return `data:image/jpeg;base64,${base64String}`
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.welcome {
  width: 100%;
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 5px;
  text-align: center;
}

.city-selector {
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-width: 180px;
  font-size: 16px;
}

.aqi-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.aqi-item {
  width: 100%;
  max-width: 500px;
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.aqi-item h3 {
  margin-top: 0;
  color: #333;
  text-align: center;
}

.aqi-value {
  font-size: 32px;
  font-weight: bold;
  margin: 15px 0;
  padding: 15px;
  border-radius: 5px;
  text-align: center;
}

.aqi-details {
  margin: 15px 0;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 5px;
}

.good {
  background-color: #4CAF50;
  color: white;
}

.moderate {
  background-color: #FFC107;
  color: black;
}

.unhealthy-sensitive {
  background-color: #FF9800;
  color: white;
}

.unhealthy {
  background-color: #F44336;
  color: white;
}

.very-unhealthy {
  background-color: #9C27B0;
  color: white;
}

.hazardous {
  background-color: #880E4F;
  color: white;
}

.health-tip {
  margin: 15px 0;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 5px;
  text-align: center;
}

.image-container {
  margin-top: 15px;
}

.health-tip img {
  max-width: 100%;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logout-btn {
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.logout-btn:hover {
  background-color: #d32f2f;
}
</style> 