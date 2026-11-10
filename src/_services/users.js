import API from "../_api"

export const getUsers = async () => {
  const { data } = await API.get("/users")
  return data.data
}

// Ambil satu user. Jika endpoint show belum ada, cari dari daftar user.
export const getUser = async (id) => {
  try {
    const { data } = await API.get(`/users/${id}`)
    return data.data
  } catch (error) {
    if (error.response?.status !== 404 && error.response?.status !== 405) throw error
    const found = (await getUsers()).find((u) => String(u.id) === String(id))
    if (!found) throw error
    return found
  }
}

export const updateUser = async (id, payload) => {
  const { data } = await API.put(`/users/${id}`, payload)
  return data
}

export const deleteUser = async (id) => {
  const { data } = await API.delete(`/users/${id}`)
  return data
}
