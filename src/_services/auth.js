import API from "../_api"
import { normalizeRole } from "../utils/roles"

// Cari token di bentuk response yang umum dipakai Laravel (Sanctum / JWT).
const extractToken = (body) =>
  body?.token ??
  body?.access_token ??
  body?.data?.token ??
  body?.data?.access_token ??
  body?.authorization?.token

// Cari data user di response login.
const extractUser = (body) =>
  body?.user ?? body?.data?.user ?? (body?.data?.email ? body.data : undefined)

const withRole = (user) => ({ ...user, role: normalizeRole(user) })

// Ambil profil user yang sedang login (endpoint Sanctum standar: GET /api/user).
export const fetchProfile = async (token) => {
  const { data } = await API.get("/user", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  return withRole(data?.data?.user ?? data?.data ?? data?.user ?? data)
}

// Mengembalikan { token, user } (user sudah memiliki field role: "admin" | "user").
export const login = async (payload) => {
  const { data } = await API.post("/login", payload)
  const token = extractToken(data)
  if (!token) {
    throw new Error("Token tidak ditemukan di response login")
  }
  const user = extractUser(data)
  return { token, user: user ? withRole(user) : await fetchProfile(token) }
}

export const register = async (payload) => {
  const { data } = await API.post("/register", payload)
  return data
}

// Hanya memberi tahu server; penghapusan sesi lokal dilakukan oleh AuthContext.
export const logout = async () => {
  try {
    await API.post("/logout")
  } catch (error) {
    console.log(error)
  }
}
