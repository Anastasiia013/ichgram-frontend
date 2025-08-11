import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import type { RootState } from "../../redux/store";
import type { Post } from "../../types/Post";
import { likePost, unlikePost, getPostById } from "../api/posts-api";

export const useLikePost = (
  post: Post | null,
  setPost?: (post: Post) => void
) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [isProcessing, setIsProcessing] = useState(false);

  const isLiked = !!(
    post &&
    currentUser &&
    Array.isArray(post.likes) &&
    post.likes.some((like) => {
      if (typeof like === "string") {
        return like === currentUser._id.toString();
      }
      if (like && typeof like === "object" && "_id" in like) {
        return (like._id as any).toString() === currentUser._id.toString();
      }
      return false;
    })
  );

  const syncPost = useCallback(async () => {
    if (!post) return;
    try {
      const updated = await getPostById(post._id);
      setPost?.(updated);
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
