import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <a href="/dashboard" className={styles.link}>
          Home
        </a>
        <a href="/search" className={styles.link}>
          Search
        </a>
        <a href="/explore" className={styles.link}>
          Explore
        </a>
        <a href="/messages" className={styles.link}>
          Messages
        </a>
        <a href="/notifications" className={styles.link}>
          Notifications
        </a>
        <a href="/create-new-post" className={styles.link}>
          Create
        </a>
      </nav>
      <p className={styles.copy}>&copy; 2025 ICHgram</p>
    </footer>
  );
};

export default Footer;
