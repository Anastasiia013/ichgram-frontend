import React from "react";
import styles from "./GradientAvatar.module.css";

interface GradientAvatarProps {
  src: string;
  size?: number;
  alt?: string;
}

const GradientAvatar: React.FC<GradientAvatarProps> = ({
  src,
  size = 60,
  alt = "avatar",
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const validSrc =
    src && src.trim() !== ""
      ? src.startsWith("/uploads")
        ? backendUrl + src
        : src
      : "/no-profile-pic-icon-11.jpg";

  const borderWidth = Math.max(Math.floor(size * 0.03), 2); // градиент
  const spacerWidth = Math.max(Math.floor(size * 0.02), 2); // белая прослойка
  const innerSize = size - borderWidth * 2;
  const imageSize = innerSize - spacerWidth * 2;

  return (
    <div
      className={styles.avatarWrapper}
      style={{
        width: size,
        height: size,
        padding: borderWidth,
      }}
    >
      <div
        className={styles.avatarInner}
        style={{
          width: innerSize,
          height: innerSize,
          padding: spacerWidth,
        }}
      >
        <img
          src={validSrc}
          alt={alt}
          className={styles.avatarImage}
          style={{
            width: imageSize,
            height: imageSize,
          }}
        />
      </div>
    </div>
  );
};

export default GradientAvatar;
