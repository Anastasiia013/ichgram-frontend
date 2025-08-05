import React from "react";
import styles from "./GradientAvatar.module.css";

interface GradientAvatarProps {
  src: string;
  size?: number;
  alt?: string;
}

const GradientAvatar: React.FC<GradientAvatarProps> = ({
  src,
  size,
  alt = "avatar",
}) => {
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL;

  const validSrc =
    src && src.trim() !== ""
      ? src.startsWith("/uploads")
        ? backendUrl + src
        : src
      : "/no-profile-pic-icon-11.jpg";

  return (
    <div className={styles.avatarWrapper} style={{ width: size, height: size }}>
      <img src={validSrc} alt={alt} className={styles.avatarImage} />
    </div>
  );
};

export default GradientAvatar;
