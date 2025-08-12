import React, { useEffect, useState } from "react";
import DropdownPanel from "../../layouts/DropdownPanel/DropdownPanel";
import styles from "./NotificationsPanel.module.css";
import { getNotifications } from "../../shared/api/notifications-api";
import { getDateLabel } from "../SinglePost/SinglePost";
import { useNavigate, useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { jwtDecode } from "jwt-decode";

const API_ORIGIN = import.meta.env.VITE_API_URL.replace("/api", "");

interface Notification {
  _id: string;
  sender: {
    username: string;
    avatarUrl?: string;
  };
  type: "like" | "comment" | "follow" | "likeOnComment";
  post?: {
    _id: string;
    imageUrl: string;
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

    // Декодируем токен, чтобы достать userId
    const { id: userId } = jwtDecode<{ id: string }>(token);
    const socket: Socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
    });

    socket.emit("join", userId);
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded);

    socket.on("newNotification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      getNotifications(token)
        .then((data) => {
          const normalizedNotifications = data.map((n) => ({
            ...n,
            post:
              typeof n.post === "string"
                ? { _id: n.post, imageUrl: "" }
                : n.post,
          }));
          const uniqueNotifications = Array.from(
            new Map(normalizedNotifications.map((n) => [n._id, n])).values()
          );
          setNotifications(uniqueNotifications);
        })
        .catch((err) => {
          console.error("Failed to fetch notifications:", err);
        });
    }
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
                  onClick={() => handleGoToUser(n.sender.username)}
                  style={{ cursor: "pointer" }}
                  src={
                    `${API_ORIGIN}${n.sender.avatarUrl}` ||
                    "/no-profile-pic-icon-11.jpg"
                  }
                  alt="avatar"
                  className={styles.avatar}
                />
                <div className={styles.text}>
                  <span className={styles.username}>{n.sender.username}</span>{" "}
                  {n.type === "like" && "liked your post."}
                  {n.type === "comment" && "commented on your post."}
                  {n.type === "follow" && "started following you."}
                  {n.type === "likeOnComment" && "liked your comment."}
                  <span className={styles.time}>
                    {getDateLabel(n.createdAt)}
                  </span>
                </div>
                {n.post?.imageUrl && (
                  <img
                    onClick={() => handleGoToPost(n.post?._id)}
                    style={{ cursor: "pointer" }}
                    src={`${API_ORIGIN}${n.post.imageUrl}`}
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
