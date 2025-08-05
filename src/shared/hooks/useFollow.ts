import { useSelector, useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import type { RootState } from "../../redux/store";
import type { User } from "../../types/User";
import {
  followUser,
  unfollowUser,
  getUserByUsername,
} from "../api/profile-api";
import { getCurrentUserApi } from "../api/auth-api";
import { updateCurrentUser } from "../../redux/auth/auth-slice";

export const useFollow = (
  user: User | null,
  setUser?: (user: User) => void
) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const [isProcessing, setIsProcessing] = useState(false);

  const isFollowing = user ? currentUser?.following?.includes(user._id) : false;

  const syncUsers = async () => {
    if (!user || !token) return;

    try {
      const updatedUser = await getUserByUsername(user.username);
      const refreshedCurrent = await getCurrentUserApi();

      if (setUser) setUser(updatedUser);
      dispatch(updateCurrentUser(refreshedCurrent.user));
    } catch (err) {
      console.error("Ошибка при синхронизации пользователей:", err);
    }
  };

  const handleFollow = useCallback(async () => {
    if (!user || !currentUser || !token || isProcessing) return;
    setIsProcessing(true);
    try {
      await followUser(user._id, token);
      await syncUsers();
    } catch (err) {
      console.error("Ошибка при подписке:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [user, currentUser, token, isProcessing]);

  const handleUnfollow = useCallback(async () => {
    if (!user || !currentUser || !token || isProcessing) return;
    setIsProcessing(true);
    try {
      await unfollowUser(user._id, token);
      await syncUsers();
    } catch (err) {
      console.error("Ошибка при отписке:", err);
    } finally {
      setIsProcessing(false);
    }
  }, [user, currentUser, token, isProcessing]);

  return { isFollowing, handleFollow, handleUnfollow, isProcessing };
};
