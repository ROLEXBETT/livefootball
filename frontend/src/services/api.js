import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://livepulse-backend-4kjo.onrender.com/api",
});

export default API;