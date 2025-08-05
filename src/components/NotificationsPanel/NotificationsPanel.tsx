import React from "react";
import DropdownPanel from "../../layouts/DropdownPanel/DropdownPanel";
import styles from "./NotificationsPanel.module.css";

interface Notification {
  id: number;
  avatar: string;
  username: string;
  text: string;
  image?: string;
  time: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const mockNotifications: Notification[] = [
  {
    id: 1,
    avatar: "/avatars/sasha.png",
    username: "sashaa",
    text: "liked your photo.",
    image: "/photos/photo1.jpg",
    time: "2d",
  },
  {
    id: 2,
    avatar: "/avatars/sasha.png",
    username: "sashaa",
    text: "commented your photo.",
    image: "/photos/photo1.jpg",
    time: "2w",
  },
  {
    id: 3,
    avatar: "/avatars/sasha.png",
    username: "sashaa",
    text: "started following.",
    image: "/photos/photo1.jpg",
    time: "2d",
  },
];

const NotificationsPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <DropdownPanel isOpen={isOpen} onClose={onClose} title="Notifications">
      <p className={styles.subheading}>New</p>
      <ul className={styles.list}>
        {mockNotifications.map((n) => (
          <li key={n.id} className={styles.notification}>
            <img src={n.avatar} alt="avatar" className={styles.avatar} />
            <div className={styles.text}>
              <span className={styles.username}>{n.username}</span> {n.text}
              <span className={styles.time}>{n.time}</span>
            </div>
            {n.image && (
              <img src={n.image} alt="thumb" className={styles.thumb} />
            )}
          </li>
        ))}
      </ul>
    </DropdownPanel>
  );
};

export default NotificationsPanel;
