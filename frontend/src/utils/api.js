import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Your backend's base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach the Authorization token if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
