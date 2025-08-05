import axios from "axios";

export const backendInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export const authInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/auth`,
});
