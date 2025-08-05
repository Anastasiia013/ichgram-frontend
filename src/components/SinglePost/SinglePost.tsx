import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";

import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

import { getPostById } from "../../shared/api/posts-api";
import { getUserById } from "../../shared/api/profile-api";
import type { Post } from "../../types/Post";
import type { User } from "../../types/User";
import EmojiPickerButton from "../../layouts/EmojiButton/EmojiButton";

import styles from "./SinglePost.module.css";

import { isToday, isYesterday, differenceInDays } from "date-fns";

import { useFollow } from "../../shared/hooks/useFollow";
import { useLike } from "../../shared/hooks/useLike";

const SinglePost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [author, setAuthor] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [commentText, setCommentText] = useState("");
  const currentUser =
    useSelector((state: RootState) => state.auth.user) || null;
  const { isFollowing, handleFollow, handleUnfollow } = useFollow(
    author,
    setAuthor
  );

  const { isLiked, handleLike, handleUnlike } = useLike(post, setPost);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleEmojiInsert = (emoji: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const before = commentText.slice(0, start);
    const after = commentText.slice(end);

    const updated = before + emoji + after;
    setCommentText(updated);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    });
  };

  const getDateLabel = (createdAt: string): string => {
    const date = new Date(createdAt);

    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";

    const daysAgo = differenceInDays(new Date(), date);
    return `${daysAgo} ${daysAgo === 1 ? "Day" : "Days"}`;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const fetchPost = async () => {
      try {
        if (!postId) return;
        const data = await getPostById(postId);

        const normalizedPost = {
          ...data,
          comments: data.comments || [],
        };
        setPost(normalizedPost);

        const authorData = await getUserById(data.author);
        setAuthor(authorData);
      } catch (err) {
        setError("Ошибка при загрузке поста");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    return () => {
      document.body.style.overflow = "";
    };
  }, [postId]);

  const onClose = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>Загрузка...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <p>{error || "Пост не найден"}</p>
          <button className={styles.closeBtn} onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.photoSection}>
          <img src={post.imageUrl} alt="Post" className={styles.photo} />
        </div>
        <div className={styles.infoSection}>
          <div className={styles.scrollableContent}>
            {author && (
              <div className={styles.authorInfo}>
                <img
                  src={author.avatarUrl || "/no-profile-pic-icon-11.jpg"}
                  alt="avatar"
                  className={styles.authorAvatar}
                />
                <p>{author.username}</p>

                {currentUser && currentUser._id !== author._id && (
                  <>
                    <span>•</span>
                    <button
                      className={styles.followBtn}
                      onClick={isFollowing ? handleUnfollow : handleFollow}
                    >
                      {isFollowing ? "Отписаться" : "Подписаться"}
                    </button>
                  </>
                )}
                <button className={styles.closeBtn} onClick={onClose}>
                  <img src="/x-lg.svg" alt="Close Post" />
                </button>
              </div>
            )}
            <div className={styles.postBlock}>
              {author && (
                <div className={styles.authorInfoShort}>
                  <img
                    src={author.avatarUrl || "/no-profile-pic-icon-11.jpg"}
                    alt="avatar"
                    className={styles.authorAvatar}
                  />
                  <span className={styles.userPost}>
                    <p>
                      {author.username} {post.caption || "Без описания"}
                    </p>
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={styles.bottomBar}>
            <div className={styles.barLine}>
              <div className={styles.actions}>
                <img
                  src={isLiked ? "/like-filled.svg" : "/like-con.svg"}
                  alt="Like"
                  className={styles.icon}
                  onClick={isLiked ? handleUnlike : handleLike}
                />

                <img
                  src="/comments-icon.svg"
                  alt="Comment"
                  className={styles.icon}
                />
              </div>

              <p className={styles.likes}>{post.likes?.length || 0} лайков</p>
              <p className={styles.time}>{getDateLabel(post.createdAt)}</p>
            </div>
            <form
              className={styles.commentForm}
              onSubmit={(e) => {
                e.preventDefault();
                if (!commentText.trim()) return;

                const newComment = {
                  username: currentUser?.username || "Unknown User",
                  text: commentText.trim(),
                };
                setPost((prev) =>
                  prev
                    ? {
                        ...prev,
                        comments: [...(prev.comments || []), newComment],
                      }
                    : prev
                );
                setCommentText("");
              }}
            >
              <EmojiPickerButton onSelect={handleEmojiInsert} />
              <textarea
                ref={textareaRef}
                placeholder="Add comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <button type="submit" disabled={!commentText.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
