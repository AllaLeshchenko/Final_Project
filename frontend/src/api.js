import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // твой backend
  withCredentials: true, // для куки
});

export default api;
