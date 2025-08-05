import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { selectAuthUser } from "../../redux/auth/auth-selectors";
import { logout } from "../../redux/auth/auth-thunks";
import type { AppDispatch } from "../../redux/store";
import Button from "../../layouts/Button/Button";

import styles from "./SidebarMenu.module.css";

const menuItems = [
  {
    label: "Home",
    icon: "/sidebar/icon-home.svg",
    iconFilled: "/sidebar/icon-home-filled.svg",
  },
  {
    label: "Search",
    icon: "/sidebar/icon-search.svg",
    iconFilled: "/sidebar/icon-search-filled.svg",
  },
  {
    label: "Explore",
    icon: "/sidebar/icon-explore.svg",
    iconFilled: "/sidebar/icon-explore-filled.svg",
  },
  {
    label: "Messages",
    icon: "/sidebar/icon-messages.svg",
    iconFilled: "/sidebar/icon-messages-filled.svg",
  },
  {
    label: "Notification",
    icon: "/sidebar/icon-notification.svg",
    iconFilled: "/sidebar/icon-notification-filled.svg",
  },
  {
    label: "Create",
    icon: "/sidebar/icon-createpost.svg",
    iconFilled: "/sidebar/icon-createpost.svg",
  },
  {
    label: "Profile",
    icon: "/sidebar/icon-ichlogo.png",
    iconFilled: "/sidebar/icon-ichlogo.png",
    isAvatar: true,
  },
];

interface SidebarProps {
  onToggleNotifications: () => void;
  onToggleSearch: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  onToggleNotifications,
  onToggleSearch,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentUser = useSelector(selectAuthUser);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const handleClick = (label: string, e: React.MouseEvent) => {
    e.preventDefault();

    if (label === "Notification") {
      onToggleNotifications();
      return;
    }

    if (label === "Search") {
      onToggleSearch();
      return;
    }

    if (label === "Explore") {
      navigate("/explore");
      return;
    }

    if (label === "Create") {
      navigate("/create-new-post", {
        state: {
          background: {
            pathname: location.pathname,
            search: location.search,
            hash: location.hash,
          },
        },
      });

      return;
    }

    if (label === "Profile") {
      if (!currentUser) return;
      navigate(`/users/${currentUser.username}`);
      return;
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <img src="/logo.svg" alt="ICHGRAM" className={styles.logo} />
      </div>

      <nav className={styles.nav}>
        {menuItems.map(({ label, icon, iconFilled, isAvatar }) => (
          <a
            href="#"
            className={styles.navItem}
            key={label}
            onMouseEnter={() => setHoveredItem(label)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={(e) => handleClick(label, e)}
          >
            <img
              src={hoveredItem === label ? iconFilled : icon}
              alt={label}
              className={isAvatar ? styles.avatarIcon : styles.icon}
            />
            <span>{label}</span>
          </a>
        ))}
      </nav>

      <div className={styles.logoutWrapper}>
        <Button text="Log out" color="danger" onClick={handleLogout} />
      </div>
    </aside>
  );
};

export default Sidebar;
