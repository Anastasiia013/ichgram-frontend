import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { selectAuthUser } from "../../redux/auth/auth-selectors";
import { logout } from "../../redux/auth/auth-thunks";
import type { AppDispatch } from "../../redux/store";
import Button from "../../layouts/Button/Button";

import styles from "./SidebarMenu.module.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

interface SidebarProps {
  onToggleNotifications: () => void;
  onToggleSearch: () => void;
  onClosePanels: () => void;
  activePanel?: "notifications" | "search" | "create" | null;
}

interface MenuItem {
  label: string;
  icon: string;
  iconFilled: string;
  path?: string;
  isAvatar?: boolean;
  panel?: "notifications" | "search" | "create";
}

const Sidebar: React.FC<SidebarProps> = ({
  onToggleNotifications,
  onToggleSearch,
  onClosePanels,
  activePanel,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useSelector(selectAuthUser);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const menuItems: MenuItem[] = [
    {
      label: "Home",
      icon: "/sidebar/icon-home.svg",
      iconFilled: "/sidebar/icon-home-filled.svg",
      path: "/dashboard",
    },
    {
      label: "Search",
      icon: "/sidebar/icon-search.svg",
      iconFilled: "/sidebar/icon-search-filled.svg",
      panel: "search",
    },
    {
      label: "Explore",
      icon: "/sidebar/icon-explore.svg",
      iconFilled: "/sidebar/icon-explore-filled.svg",
      path: "/explore",
    },
    {
      label: "Messages",
      icon: "/sidebar/icon-messages.svg",
      iconFilled: "/sidebar/icon-messages-filled.svg",
      path: "/messages",
    },
    {
      label: "Notification",
      icon: "/sidebar/icon-notification.svg",
      iconFilled: "/sidebar/icon-notification-filled.svg",
      panel: "notifications",
    },
    {
      label: "Create",
      icon: "/sidebar/icon-createpost.svg",
      iconFilled: "/sidebar/icon-createpost.svg",
      panel: "create",
    },
    {
      label: "Profile",
      icon: "/no-profile-pic-icon-11.jpg",
      iconFilled: "/no-profile-pic-icon-11.jpg",
      isAvatar: true,
      path: currentUser ? `/users/${currentUser.username}` : undefined,
    },
  ];

  const handleClick = (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    switch (item.label) {
      case "Home":
        navigate("/dashboard");
        onClosePanels();
        break;
      case "Explore":
        navigate("/explore");
        onClosePanels();
        break;
      case "Profile":
        if (!currentUser) return;
        navigate(`/users/${currentUser.username}`);
        onClosePanels();
        break;
      case "Search":
        onToggleSearch();
        break;
      case "Notification":
        onToggleNotifications();
        break;
      case "Messages":
        navigate("/messages");
        break;
      case "Create":
        navigate("/create-new-post", { state: { background: location } });
        break;
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <img src="/logo.svg" alt="ICHGRAM" className={styles.logo} />
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isRouteActive =
            item.path && location.pathname.startsWith(item.path);
          const isPanelActive = item.panel && activePanel === item.panel;
          const isActive = isRouteActive || isPanelActive;
          const isHovered = hoveredItem === item.label;

          const imgSrc = item.isAvatar
            ? currentUser?.avatarUrl
              ? `${BACKEND_URL}${currentUser.avatarUrl}`
              : item.icon
            : isActive || isHovered
            ? item.iconFilled
            : item.icon;

          return (
            <a
              href="#"
              key={item.label}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              onMouseEnter={() => setHoveredItem(item.label)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={(e) => handleClick(item, e)}
            >
              <img
                src={imgSrc}
                alt={item.label}
                className={item.isAvatar ? styles.avatarIcon : styles.icon}
              />
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className={styles.logoutWrapper}>
        <Button text="Log out" color="danger" onClick={handleLogout} />
      </div>
    </aside>
  );
};

export default Sidebar;
