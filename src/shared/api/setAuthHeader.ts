import { authInstance } from "./instance";

export const setAuthHeader = (token: string | null) => {
  if (token) {
    authInstance.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete authInstance.defaults.headers.Authorization;
  }
};