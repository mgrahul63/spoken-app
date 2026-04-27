import api from "./axiosInstance";

export const fetchWords = async () => {
  try {
    const { data } = await api.get("/api/words");
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
