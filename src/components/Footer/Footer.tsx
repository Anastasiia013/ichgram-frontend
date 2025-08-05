import React from "react";
import styles from "./Footer.module.css";

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <nav className={styles.nav}>
        <a href="" className={styles.link}>
          Home
        </a>
        <a href="" className={styles.link}>
          Search
        </a>
        <a href="" className={styles.link}>
          Explore
        </a>
        <a href="" className={styles.link}>
          Messages
        </a>
        <a href="" className={styles.link}>
          Notifications
        </a>
        <a href="" className={styles.link}>
          Create
        </a>
      </nav>
      <p className={styles.copy}>&copy; 2025 ICHgram</p>
    </footer>
  );
};

export default Footer;
