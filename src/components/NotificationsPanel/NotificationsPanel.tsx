import React, { useEffect, useState } from "react";
import DropdownPanel from "../../layouts/DropdownPanel/DropdownPanel";
import styles from "./NotificationsPanel.module.css";
import { getNotifications } from "../../shared/api/notifications-api";
import { getDateLabel } from "../SinglePost/SinglePost";
import { useNavigate, useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const API_ORIGIN = import.meta.env.VITE_API_URL.replace("/api", "");

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

interface Notification {
  _id: string;
  sender: {
    username: string;
    avatarUrl?: string;
  };
  type: "like" | "comment" | "follow" | "likeOnComment";
  post?: {
    _id: string;
    imageUrl?: string;
  };
  isRead: boolean;
  createdAt: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  token: string;
}

const NotificationsPanel: React.FC<Props> = ({ isOpen, onClose, token }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token) return;

    const { id: userId } = jwtDecode<{ id: string }>(token);

    // Подключаемся к сокету
    const socket: Socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token },
    });

    socket.emit("join", userId);

    socket.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => {
        if (prev.some((n) => n._id === notification._id)) return prev;
        return [notification, ...prev];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (!isOpen) return;

    getNotifications(token)
      .then((data) => {
        const normalized = data.map((n) => ({
          ...n,
          post:
            typeof n.post === "string" ? { _id: n.post, imageUrl: "" } : n.post,
        }));

        // Убираем дубликаты по _id уведомления
        const unique = Array.from(
          new Map(normalized.map((n) => [n._id, n])).values()
        );

        setNotifications(unique);
      })
      .catch((err) => console.error("Failed to fetch notifications:", err));
  }, [isOpen, token]);

  if (!isOpen) return null;

  const handleGoToUser = (username: string) => {
    onClose();
    navigate(`/users/${username}`);
  };

  const handleGoToPost = (postId?: string) => {
    if (!postId) return;
    onClose();
    navigate(`/posts/${postId}`, { state: { background: location } });
  };

  const renderNotificationText = (n: Notification) => {
    switch (n.type) {
      case "like":
        return "liked your post.";
      case "comment":
        return "commented on your post.";
      case "follow":
        return "started following you.";
      case "likeOnComment":
        return "liked your comment.";
      default:
        return "";
    }
  };

  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Notifications">
      {notifications.length === 0 ? (
        <p className={styles.subheading}>No new notifications</p>
      ) : (
        <>
          <p className={styles.subheading}>New</p>
          <ul className={styles.list}>
            {notifications.map((n) => (
              <li key={n._id} className={styles.notification}>
                <img
                  onClick={() => n.sender && handleGoToUser(n.sender.username)}
                  style={{ cursor: n.sender ? "pointer" : "default" }}
                  src={
                    n.sender?.avatarUrl
                      ? `${API_ORIGIN}${n.sender.avatarUrl}`
                      : "/no-profile-pic-icon-11.jpg"
                  }
                  alt="avatar"
                  className={styles.avatar}
                />

                <div className={styles.text}>
                  <span className={styles.username}>
                    {n.sender?.username || "Unknown User"}
                  </span>{" "}
                  {renderNotificationText(n)}
                  <span className={styles.time}>
                    {getDateLabel(n.createdAt)}
                  </span>
                </div>

                {n.post?._id && (
                  <img
                    onClick={() => handleGoToPost(n.post?._id)}
                    style={{ cursor: "pointer" }}
                    src={
                      n.post?.imageUrl
                        ? `${API_ORIGIN}${n.post.imageUrl}`
                        : "/no-post-thumb.jpg"
                    }
                    alt="thumb"
                    className={styles.thumb}
                  />
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </DropdownPanel>
  );
};

export default NotificationsPanel;
