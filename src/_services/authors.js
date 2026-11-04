import API from "../_api"

export const getAuthors = async () => {
  const { data } = await API.get("/authors");
  return data.data;
};

// Ambil satu author. Jika endpoint show belum ada, cari dari daftar author.
export const getAuthor = async (id) => {
  try {
    const { data } = await API.get(`/authors/${id}`);
    return data.data;
  } catch (error) {
    if (error.response?.status !== 404 && error.response?.status !== 405) throw error;
    const list = await getAuthors();
    const found = list.find((a) => String(a.id) === String(id));
    if (!found) throw error;
    return found;
  }
};

export const createAuthor = async (payload) => {
  const { data } = await API.post("/authors", payload);
  return data;
};

export const updateAuthor = async (id, payload) => {
  const { data } = await API.put(`/authors/${id}`, payload);
  return data;
};

export const deleteAuthor = async (id) => {
  const { data } = await API.delete(`/authors/${id}`);
  return data;
};
