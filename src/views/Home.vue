<template>
  <div class="home">
    <h2>空气质量监测系统</h2>
    <div class="content">
      <div v-if="loading">加载中...</div>
      <div v-else-if="error">{{ error }}</div>
      <template v-else>
        <!-- 个人用户页面 -->
        <div v-if="userStore.user?.userType === 'individual'" class="personal-view">
          <div class="welcome">
            <h3>欢迎回来，{{ userStore.user?.username }}</h3>
          </div>
          <div v-for="item in aqiData" :key="item.site" class="aqi-item">
            <h3>{{ item.name }}</h3>
            <div class="aqi-value" :class="getAQIClass(item.aqi)">
              AQI: {{ item.aqi }}
            </div>
            <div class="health-tip">
              <p>{{ getHealthTip(item.aqi_level) }}</p>
              <img v-if="item.hint_image" :src="'data:image/jpeg;base64,' + item.hint_image" alt="健康提示图片" />
            </div>
          </div>
        </div>
        
        <!-- 企业用户页面 -->
        <div v-else class="enterprise-view">
          <div v-for="item in aqiData" :key="item.site" class="aqi-item">
            <h3>{{ item.name }}</h3>
            <div class="aqi-value" :class="getAQIClass(item.aqi)">
              AQI: {{ item.aqi }}
            </div>
            <div class="health-tip">
              <p>{{ getHealthTip(item.aqi_level) }}</p>
            </div>
          </div>
        </div>
      </template>
      <button @click="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAQIStore } from '../store'
import { useUserStore } from '../store'

const router = useRouter()
const aqiStore = useAQIStore()
const userStore = useUserStore()
const { aqiData, loading, error } = aqiStore

onMounted(() => {
  aqiStore.fetchAQIData()
})

const getAQIClass = (aqi: number) => {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'unhealthy-sensitive'
  if (aqi <= 200) return 'unhealthy'
  if (aqi <= 300) return 'very-unhealthy'
  return 'hazardous'
}

const getHealthTip = (aqiLevel: number) => {
  const tips = {
    1: '空气质量优，适合户外活动',
    2: '空气质量良，适合户外活动',
    3: '轻度污染，敏感人群减少户外活动',
    4: '中度污染，减少户外活动',
    5: '重度污染，避免户外活动',
    6: '严重污染，请待在室内'
  }
  return tips[aqiLevel] || '未知空气质量'
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
  text-align: center;
}

.welcome {
  margin-bottom: 30px;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 5px;
}

.aqi-item {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: left;
}

.aqi-item h3 {
  margin-top: 0;
  color: #333;
}

.aqi-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
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
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 5px;
}

.health-tip img {
  max-width: 100%;
  margin-top: 10px;
  border-radius: 5px;
}

button {
  margin-top: 20px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #d32f2f;
}
</style> 