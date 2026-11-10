import axios from "axios"
import { authStorage } from "../utils/storage"

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: { Accept: "application/json" },
})

// Kirim token (kalau ada) di setiap request.
API.interceptors.request.use((config) => {
  const token = authStorage.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Token ditolak server (kedaluwarsa / tidak valid): bersihkan sesi dan kembali ke login.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const onLoginPage = window.location.pathname === "/login"
    if (error.response?.status === 401 && !onLoginPage) {
      authStorage.clear()
      window.location.assign("/login")
    }
    return Promise.reject(error)
  },
)

export default API
