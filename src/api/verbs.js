import api from "./axiosInstance";

export const fetchVerbs = async () => {
  try {
    const { data } = await api.get("/api/verbs");
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
};
