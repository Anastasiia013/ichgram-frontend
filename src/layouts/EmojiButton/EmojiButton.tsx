import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import type { EmojiClickData } from "emoji-picker-react";
import styles from "./EmojiButton.module.css";

type EmojiPickerButtonProps = {
  onSelect: (emoji: string) => void;
};

const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onSelect(emojiData.emoji);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      ref={pickerRef}
    >
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <img src="/emoji-icon.svg" alt="Emoji" />
      </button>
      {isOpen && (
        <div style={{ position: "absolute", bottom: "40px", zIndex: 10 }}>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            className={styles.customEmojiPicker}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
