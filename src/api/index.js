import api from "./axiosInstance";

// get current user
export const getMe = () => {
  return api.get("/api/auth/me");
};

// login
export const loginUser = (email, password) => {
  return api.post("/api/auth/login", { email, password });
};

// register
export const registerUser = (name, email, password) => {
  return api.post("/api/auth/register", { name, email, password });
};

export const getOverviewStats = () => {
  return api.get("/api/progress/stats/overview");
};

export const getLessons = () => { 
  return api.get("/api/lessons");
};

export const getLessonByLevelAndDay = (levelId, day) => {
  return api.get(`/api/lessons/${levelId}/${day}`);
};

// get all progress
export const getAllProgress = () => {
  return api.get("/api/progress");
};

// get single lesson progress
export const getLessonProgress = (lessonId) => {
  return api.get(`/api/progress/${lessonId}`);
};

// update progress
export const updateProgress = (payload) => {
  return api.post("/api/progress/update", payload);
};
