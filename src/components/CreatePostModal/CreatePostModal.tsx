import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { createNewPost } from "../../shared/api/posts-api";
import EmojiPickerButton from "../../layouts/EmojiButton/EmojiButton";

import styles from "./CreatePostModal.module.css";

const CreatePostModal: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const author = useSelector((state: RootState) => state.auth.user);

  const token = useSelector((state: RootState) => state.auth.token);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => navigate(-1);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || !caption.trim()) return;

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("caption", caption);

    try {
      setIsSubmitting(true);
      await createNewPost(formData, token);
      navigate(-1);
    } catch (err) {
      console.error("Ошибка при создании поста:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalWrapper}>
        <div className={styles.modalHeader}>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Закрыть модалку"
          >
            <img src="/x-lg.svg" alt="Close" />
          </button>

          <h3 className={styles.modalTitle}>Create new post</h3>

          <button
            className={styles.shareBtn}
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedImage || !caption.trim()}
          >
            {isSubmitting ? "Posting..." : "Share"}
          </button>
        </div>

        <div className={styles.modal}>
          <div
            className={styles.photoSection}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className={styles.photo} />
            ) : (
              <div className={styles.uploadPlaceholder}>
                <div className={styles.imageBox}>
                  <img src="/upload-img.svg" alt="Upload" />
                </div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </div>

          <div className={styles.infoSection}>
            {author && (
              <div className={styles.authorInfo}>
                <img
                  src={author.avatarUrl || "/no-profile-pic-icon-11.jpg"}
                  alt="avatar"
                  className={styles.authorAvatar}
                />
                <p>{author.username}</p>
              </div>
            )}
            <EmojiPickerButton onSelect={handleEmojiInsert} />

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.captionCounter}>
                {caption.length}/2 200
              </div>
              <textarea
                className={styles.textarea}
                ref={textareaRef}
                placeholder="Add comment"
                value={caption}
                maxLength={2200}
                onChange={(e) => setCaption(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;
