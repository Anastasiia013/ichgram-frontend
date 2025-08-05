import { backendInstance } from "./instance";

interface SignupPayload {
  email: string;
  password: string;
  fullname: string;
  username: string;
}

export const signupUserApi = async (payload: SignupPayload) => {
  const { data } = await backendInstance.post("/users/register", payload);
  return data;
};

export const verifyUserApi = async (code: string) => {
  const { data } = await backendInstance.post("/users/verify", { code });
  return data;
};

export const sendResetLinkApi = async (email: string) => {
  const response = await backendInstance.post("/users/forgot-password", {
    email,
  });
  return response.data;
};

export const resetPasswordApi = async (
  verificationCode: string,
  newPassword: string
) => {
  const response = await backendInstance.post("/users/reset-password", {
    verificationCode,
    newPassword,
  });
  return response.data;
};
