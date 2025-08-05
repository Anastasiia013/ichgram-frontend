import React from "react";
import styles from "./ConfirmationPlaceholder.module.css";

interface ConfirmationPlaceholderProps {
  imageSrc?: string;
  title: string;
  message: string;
}

const ConfirmationPlaceholder: React.FC<ConfirmationPlaceholderProps> = ({
  imageSrc = "/illo-confirm-refresh-light.png",
  title,
  message,
}) => {
  return (
    <div className={styles.confirmContainer}>
      <img src={imageSrc} alt="Confirmation illustration" />
      <h1>{title}</h1>
      <p className={styles.confirmText}>{message}</p>
    </div>
  );
};

export default ConfirmationPlaceholder;
