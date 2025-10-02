import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // твой бэкенд
  withCredentials: true, // для работы с cookie/tokens
});

export default api;
