import { authInstance } from "./instance";
import type { LoginPayload } from "../../redux/auth/auth-thunks";

export const loginUserApi = async (payload: LoginPayload) => {
  const { data } = await authInstance.post("/login", payload);
  authInstance.defaults.headers["Authorization"] = `Bearer ${data.token}`;
  return data;
};

export const getCurrentUserApi = async () => {
  const { data } = await authInstance.get("/current");
  return data;
};

export const logoutUserApi = async () => {
  const { data } = await authInstance.post("/logout");
  delete authInstance.defaults.headers["Authorization"];
  return data;
};
