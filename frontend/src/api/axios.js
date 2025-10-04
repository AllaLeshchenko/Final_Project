import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // backend url
  withCredentials: true,                // обязательно, чтобы cookie шли на backend
});

export default api;
