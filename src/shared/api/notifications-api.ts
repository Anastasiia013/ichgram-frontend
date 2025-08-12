import { backendInstance } from "./instance";

export interface Notification {
  _id: string;
  recipient: string;
  sender: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  type: "like" | "comment" | "follow" | "likeOnComment";
  post?: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotifications = async (
  token: string
): Promise<Notification[]> => {
  const { data } = await backendInstance.get("/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return data;
};

export const markAllNotificationsAsRead = async (token: string) => {
  const { data } = await backendInstance.patch(
    "/notifications/read",
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data; // ожидаем { success: true }
};
