import API from "../_api"

export const getGenres = async () => {
  const { data } = await API.get("/genres");
  return data.data;
};

// Ambil satu genre. Jika endpoint show belum ada, cari dari daftar genre.
export const getGenre = async (id) => {
  try {
    const { data } = await API.get(`/genres/${id}`);
    return data.data;
  } catch (error) {
    if (error.response?.status !== 404 && error.response?.status !== 405) throw error;
    const list = await getGenres();
    const found = list.find((g) => String(g.id) === String(id));
    if (!found) throw error;
    return found;
  }
};

export const createGenre = async (payload) => {
  const { data } = await API.post("/genres", payload);
  return data;
};

export const updateGenre = async (id, payload) => {
  const { data } = await API.put(`/genres/${id}`, payload);
  return data;
};

export const deleteGenre = async (id) => {
  const { data } = await API.delete(`/genres/${id}`);
  return data;
};
