<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <div v-if="error" class="error">{{ error }}</div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api'
import { useUserStore } from '../store'
import { useAQIStore } from '../store'

const router = useRouter()
const userStore = useUserStore()
const aqiStore = useAQIStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter your username and password'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const response = await login({
      username: username.value,
      password: password.value,
      userType: 'individual' // 默认使用个人用户类型
    })
    
    // 保存用户信息和token
    userStore.setToken(response.data.token)
    
    // 创建完整的用户对象
    const user = {
      username: response.data.user.username,
      password: '', // 密码字段为空
      userType: response.data.user.userType
    }
    userStore.setUser(user)
    
    // 保存城市列表和默认城市AQI数据
    if (response.data.supported_cities) {
      aqiStore.cities = response.data.supported_cities
      
      if (response.data.default_city_aqi) {
        aqiStore.aqiData = response.data.default_city_aqi
        aqiStore.currentCity = aqiStore.cities.find(
          city => city.site === response.data.default_city_aqi?.site
        ) || null
      }
    }
    
    router.push('/home')
  } catch (err) {
    error.value = 'Login failed. Please check your username and password.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login {
  max-width: 500px;
  margin: 120px auto;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  color: #333;
}

form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
}

.error {
  color: #f44336;
  font-size: 15px;
  margin: 5px 0;
}

button {
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  margin-top: 10px;
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style> 