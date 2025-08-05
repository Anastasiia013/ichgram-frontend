import { backendInstance } from "./instance";
import type { Post } from "../../types/Post";

const API_ORIGIN = import.meta.env.VITE_API_URL.replace("/api", "");

export const getExplorePosts = async () => {
  const { data } = await backendInstance.get("/posts/explore");

  // Добавляем базовый адрес к imageUrl
  const normalized = data.map((post: any) => ({
    ...post,
    imageUrl: `${API_ORIGIN}${post.imageUrl}`,
  }));

  return normalized;
};

export const getPostsByUsername = async (username: string): Promise<Post[]> => {
  const res = await backendInstance.get(`/posts/${username}/posts`);

  // Добавляем базовый адрес к imageUrl
  const normalized = res.data.map((post: any) => ({
    ...post,
    imageUrl: `${API_ORIGIN}${post.imageUrl}`,
  }));

  return normalized;
};

export const getPostById = async (postId: string): Promise<Post> => {
  const { data } = await backendInstance.get(`/posts/${postId}`);
  return {
    ...data,
    imageUrl: `${API_ORIGIN}${data.imageUrl}`, // 👈 вот это важно
  };
};

export const likePost = async (postId: string, token: string) => {
  const { data } = await backendInstance.post(
    `/posts/${postId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const unlikePost = async (postId: string, token: string) => {
  const { data } = await backendInstance.post(
    `/posts/${postId}/unlike`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const likeComment = async (
  postId: string,
  commentId: string,
  token: string
) => {
  const { data } = await backendInstance.post(
    `/posts/${postId}/comments/${commentId}/like`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const unlikeComment = async (
  postId: string,
  commentId: string,
  token: string
) => {
  const { data } = await backendInstance.post(
    `/posts/${postId}/comments/${commentId}/unlike`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const createNewPost = async (
  formData: FormData,
  token: string
): Promise<void> => {
  await backendInstance.post("/posts/create-new-post", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
