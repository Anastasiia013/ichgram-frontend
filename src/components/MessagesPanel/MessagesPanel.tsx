import React, { useState } from "react";
import DropdownPanel from "../../layouts/DropdownPanel/DropdownPanel";

import { useSelector } from "react-redux";
import { selectAuthUser } from "../../redux/auth/auth-selectors";

import styles from "./MessagesPanel.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  token: string; // пока не используется, будет нужен при реальном API
}

interface Chat {
  id: string;
  fullname: string;
  avatarUrl?: string;
  lastMessage: string;
  time: string; // строка вида "14:32" или "Yesterday"
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const staticChats: Chat[] = [
  {
    id: "1",
    fullname: "Alice Johnson",
    avatarUrl: "/no-profile-pic-icon-11.jpg",
    lastMessage: "Hey, how are you?",
    time: "14:32",
  },
  {
    id: "2",
    fullname: "Bob Smith",
    avatarUrl: "/no-profile-pic-icon-11.jpg",
    lastMessage: "Got the files, thanks!",
    time: "Yesterday",
  },
  {
    id: "3",
    fullname: "Charlie Brown",
    avatarUrl: "/no-profile-pic-icon-11.jpg",
    lastMessage: "See you tomorrow 👋",
    time: "Mon",
  },
];

const MessagesPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const [chats] = useState<Chat[]>(staticChats);
  const user = useSelector(selectAuthUser);
  return (
    <DropdownPanel
      isOpen={isOpen}
      onClose={onClose}
      title={user?.username || "Messages"}
    >
      {chats.length > 0 ? (
        <ul className={styles.list}>
          {chats.map((chat) => (
            <li key={chat.id} className={styles.item}>
              <img
                src={
                  chat.avatarUrl && chat.avatarUrl.trim() !== ""
                    ? chat.avatarUrl.startsWith("/uploads")
                      ? backendUrl + chat.avatarUrl
                      : chat.avatarUrl
                    : "/no-profile-pic-icon-11.jpg"
                }
                alt={`${chat.fullname} avatar`}
                className={styles.avatar}
              />
              <div className={styles.chatInfo}>
                <p className={styles.fullname}>{chat.fullname}</p>
                <span className={styles.lastMessage}>{chat.lastMessage}</span>
              </div>
              <span className={styles.time}>{chat.time}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No chats yet</p>
      )}
    </DropdownPanel>
  );
};

export default MessagesPanel;
