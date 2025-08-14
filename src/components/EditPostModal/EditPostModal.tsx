import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { editPost } from "../../shared/api/posts-api";
import EmojiPickerButton from "../../layouts/EmojiButton/EmojiButton";
import GradientAvatar from "../../layouts/GradientAvatar/GradientAvatar";
import type { Post } from "../../types/Post";

import styles from "../../components/CreatePostModal/CreatePostModal.module.css";

type Props = {
  postId: string;
  initialCaption: string;
  previewUrl: string;
  onClose: () => void;
  onSaved: (updatedPost: Post) => void;
};

const EditPostModal: React.FC<Props> = ({
  postId,
  initialCaption,
  previewUrl,
  onClose,
  onSaved,
}) => {
  const token = useSelector((state: RootState) => state.auth.token);
  const author = useSelector((state: RootState) => state.auth.user);

  const [caption, setCaption] = useState(initialCaption);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleEmojiInsert = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = caption.slice(0, start);
    const after = caption.slice(end);
    const updated = before + emoji + after;
    setCaption(updated);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      setError("Caption cannot be empty");
      return;
    }

    if (!token) {
      setError("You are not authorized");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await editPost(postId, caption.trim(), token);

      // Проверка типа на всякий случай
      if (!updated || !updated.imageUrl) {
        throw new Error("Invalid post data received from server");
      }

      onSaved(updated);
      onClose();
    } catch (err: any) {
      console.error("Ошибка при редактировании поста:", err);
      setError(err.message || "Error updating post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalWrapper}>
        <div className={styles.modalHeader}>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Закрыть модалку"
          >
            <img src="/x-lg.svg" alt="Close" />
          </button>

          <h3 className={styles.modalTitle}>Edit post</h3>

          <button
            className={styles.shareBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !caption.trim()}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.modal}>
          <div className={styles.photoSection}>
            <img src={previewUrl} alt="Preview" className={styles.photo} />
          </div>

          <div className={styles.infoSection}>
            {author && (
              <div className={styles.authorInfo}>
                <GradientAvatar src={author.avatarUrl} alt="avatar" size={28} />
                <p>{author.username}</p>
              </div>
            )}

            <EmojiPickerButton onSelect={handleEmojiInsert} />

            <div className={styles.form}>
              <div className={styles.captionCounter}>{caption.length}/2200</div>
              <textarea
                className={styles.textarea}
                ref={textareaRef}
                placeholder="Edit caption"
                value={caption}
                maxLength={2200}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
