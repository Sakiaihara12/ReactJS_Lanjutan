import API from "../_api"

const TOKEN_KEY = "token"

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const isLoggedIn = () => !!getToken()

// Cari token di bentuk response yang umum dipakai Laravel (Sanctum / JWT).
const extractToken = (body) =>
  body?.token ??
  body?.access_token ??
  body?.data?.token ??
  body?.data?.access_token ??
  body?.authorization?.token

export const login = async (payload) => {
  const { data } = await API.post("/login", payload)
  const token = extractToken(data)
  if (!token) {
    throw new Error("Token tidak ditemukan di response login")
  }
  localStorage.setItem(TOKEN_KEY, token)
  return data
}

export const register = async (payload) => {
  const { data } = await API.post("/register", payload)
  return data
}

export const logout = async () => {
  try {
    await API.post("/logout")
  } catch (error) {
    // Abaikan: token tetap dihapus di sisi frontend.
    console.log(error)
  } finally {
    localStorage.removeItem(TOKEN_KEY)
  }
}
