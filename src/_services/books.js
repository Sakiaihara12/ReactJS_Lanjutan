import API from "../_api"

export const getBooks = async () => {
  const { data } = await API.get("/books")
  return data.data
}

// Ambil satu buku. Jika endpoint show belum ada, cari dari daftar buku.
export const getBook = async (id) => {
  try {
    const { data } = await API.get(`/books/${id}`)
    return data.data
  } catch (error) {
    if (error.response?.status !== 404 && error.response?.status !== 405) throw error
    const found = (await getBooks()).find((b) => String(b.id) === String(id))
    if (!found) throw error
    return found
  }
}

// Buku terlaris untuk beranda. Kalau backend belum punya GET /books/popular,
// pakai beberapa buku pertama dari daftar buku.
export const getPopularBooks = async (limit = 4) => {
  try {
    const { data } = await API.get("/books/popular")
    return (data.data ?? []).slice(0, limit)
  } catch {
    return (await getBooks()).slice(0, limit)
  }
}

// `formData` berisi cover (file) sehingga dikirim sebagai multipart.
export const createBook = async (formData) => {
  const { data } = await API.post("/books", formData)
  return data
}

// Laravel tidak membaca multipart pada method PUT, jadi dikirim POST + _method=PUT.
export const updateBook = async (id, formData) => {
  formData.append("_method", "PUT")
  const { data } = await API.post(`/books/${id}`, formData)
  return data
}

export const deleteBook = async (id) => {
  const { data } = await API.delete(`/books/${id}`)
  return data
}
