import { backendInstance } from "./instance";
import type { User } from "../../types/User";

export const getUserByUsername = async (username: string): Promise<User> => {
  const res = await backendInstance.get(`/users/${username}`);
  return res.data;
};

export const getUserById = async (userId: string): Promise<User> => {
  const res = await backendInstance.get(`/users/by-id/${userId}`);
  return res.data;
};

export const followUser = async (userId: string, token: string) => {
  const { data } = await backendInstance.post(
    `/users/${userId}/follow`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const unfollowUser = async (userId: string, token: string) => {
  const { data } = await backendInstance.post(
    `/users/${userId}/unfollow`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const searchUsers = async (query: string) => {
  const res = await backendInstance.get(`/users/search?q=${query}`);
  return res.data;
};

export const updateUserProfile = async (formData: FormData, token: string) => {
  const response = await backendInstance.patch("/users/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
