import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import type { RootState } from "../../redux/store";
import { likeComment, unlikeComment, getPostById } from "../api/posts-api";
import type { Post } from "../../types/Post";
import type { Comment } from "../../types/Comment";

export const useLikeComment = (
  post: Post | null,
  setPost?: (post: Post) => void
) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [isProcessing, setIsProcessing] = useState(false);

  const isCommentLiked = (comment: Comment, currentUserId: string) => {
    return comment.likes.some((likeUser) => {
      if (typeof likeUser === "string") {
        return likeUser === currentUserId;
      }
      return likeUser._id === currentUserId;
    });
  };

  const syncPost = useCallback(async () => {
    if (!post) return;
    try {
      const updated = await getPostById(post._id);
      setPost?.(updated);
    } catch (err) {
      console.error("Ошибка при синхронизации поста:", err);
    }
  }, [post, setPost]);

  const handleLikeComment = useCallback(
    async (commentId: string) => {
      if (!post || !currentUser || !token || isProcessing) return;
      setIsProcessing(true);
      try {
        await likeComment(post._id, commentId, token);
        await syncPost();
      } catch (err) {
        console.error("Ошибка при лайке комментария:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [post, currentUser, token, isProcessing, syncPost]
  );

  const handleUnlikeComment = useCallback(
    async (commentId: string) => {
      if (!post || !currentUser || !token || isProcessing) return;
      setIsProcessing(true);
      try {
        await unlikeComment(post._id, commentId, token);
        await syncPost();
      } catch (err) {
        console.error("Ошибка при удалении лайка комментария:", err);
      } finally {
        setIsProcessing(false);
      }
    },
    [post, currentUser, token, isProcessing, syncPost]
  );

  return {
    isCommentLiked,
    handleLikeComment,
    handleUnlikeComment,
    isProcessing,
  };
};
