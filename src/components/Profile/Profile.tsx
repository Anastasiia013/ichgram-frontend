import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";

import { useFollow } from "../../shared/hooks/useFollow";
import { getUserByUsername } from "../../shared/api/profile-api";
import { fetchPostsByUsername } from "../../redux/posts/posts-thunks";
import { setShouldReloadPosts } from "../../redux/posts/posts-slice";

import type { User } from "../../types/User";
import GradientAvatar from "../../layouts/GradientAvatar/GradientAvatar";
import Button from "../../layouts/Button/Button";
import BioWithToggle from "./BioWithToggle/BioWithToggle";
import ProfilePosts from "./ProfilePosts/ProfilePosts";

import styles from "./Profile.module.css";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);

  const shouldReloadPosts = useSelector(
    (state: RootState) => state.posts.shouldReloadPosts
  );

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const posts = useSelector((state: RootState) => state.posts.posts);
  const loading = useSelector((state: RootState) => state.posts.loading);
  const error = useSelector((state: RootState) => state.posts.error);

  const { isFollowing, handleFollow, handleUnfollow, isProcessing } = useFollow(
    user,
    setUser
  );

  useEffect(() => {
    if (shouldReloadPosts && username) {
      dispatch(fetchPostsByUsername(username));
      dispatch(setShouldReloadPosts(false));
    }
  }, [shouldReloadPosts, dispatch, username]);

  useEffect(() => {
    if (!username) return;
    dispatch(fetchPostsByUsername(username));
  }, [username, dispatch]);

  useEffect(() => {
    if (!username) return;
    if (username === currentUser?.username && posts.length === 0) {
      dispatch(fetchPostsByUsername(username));
    }

    const fetchUser = async () => {
      try {
        const freshUser = await getUserByUsername(username);
        setUser(freshUser);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
      }
    };

    fetchUser();
  }, [username, dispatch, currentUser, posts.length]);

  if (!user) return <p>Loading profile...</p>;
  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <GradientAvatar
          src={user.avatarUrl || "/no-profile-pic-icon-11.jpg"}
          size={168}
          alt={`${user.username} avatar`}
        />
        <div className={styles.profileInfo}>
          <div className={styles.topRow}>
            <h2>{user.username}</h2>

            {currentUser?.username === user.username ? (
              <button
                className={styles.editBtn}
                onClick={() => navigate(`/users/${username}/edit-my-profile`)}
              >
                Edit Profile
              </button>
            ) : (
              <Button
                text={isFollowing ? "Unfollow" : "Follow"}
                color={isFollowing ? "danger" : "primary"}
                onClick={isFollowing ? handleUnfollow : handleFollow}
                disabled={isProcessing}
              />
            )}
          </div>

          <div className={styles.stats}>
            <div className={styles.userInfo}>
              <p className={styles.boldNumber}>{posts.length}</p>
              <p>posts</p>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.boldNumber}>{user.followers.length}</p>
              <p>followers</p>
            </div>
            <div className={styles.userInfo}>
              <p className={styles.boldNumber}>{user.following.length}</p>
              <p>following</p>
            </div>
          </div>

          <div className={styles.bio}>
            <strong>{user.fullname}</strong>
            <BioWithToggle text={user.bio} />
            {user.link && (
              <a href={user.link} target="_blank" rel="noopener noreferrer">
                {user.link}
              </a>
            )}
          </div>
        </div>
      </div>

      <ProfilePosts posts={posts} />
    </div>
  );
};

export default Profile;
