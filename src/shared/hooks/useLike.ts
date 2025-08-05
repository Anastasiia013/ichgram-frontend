import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import type { RootState } from "../../redux/store";
import type { Post } from "../../types/Post";
import { likePost, unlikePost, getPostById } from "../api/posts-api";

export const useLike = (post: Post | null, setPost?: (post: Post) => void) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [isProcessing, setIsProcessing] = useState(false);

  const isLiked = !!(
    post &&
    currentUser?._id &&
    post.likes.some((id) => id.toString() === currentUser._id)
  );

  const syncPost = useCallback(async () => {
    if (!post) return;
    try {
      const updated = await getPostById(post._id);
      if (setPost) setPost(updated);
    } catch (err) {
      console.error("Ошибка при синхронизации поста:", err);
    }
  }, [post, setPost]);

  const handleLike = useCallback(async () => {
    if (!post || !currentUser || !token || isProcessing) return;
    setIsProcessing(true);
    try {
      await likePost(post._id, token);
      await syncPost();
    } catch (err) {
      console.error("Ошибка при лайке поста:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [post, currentUser, token, isProcessing, syncPost]);

  const handleUnlike = useCallback(async () => {
    if (!post || !currentUser || !token || isProcessing) return;
    setIsProcessing(true);
    try {
      await unlikePost(post._id, token);
      await syncPost();
    } catch (err) {
      console.error("Ошибка при удалении лайка:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [post, currentUser, token, isProcessing, syncPost]);

  return { isLiked, handleLike, handleUnlike, isProcessing };
};
