import axios from "axios";

const api = axios.create({
  baseURL: "https://api.example.com", // Đổi thành URL của backend
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Lỗi API:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
