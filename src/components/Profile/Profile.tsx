import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";

import { useFollow } from "../../shared/hooks/useFollow";
import { getUserByUsername } from "../../shared/api/profile-api";
import { getPostsByUsername } from "../../shared/api/posts-api";
import type { User } from "../../types/User";
import type { Post } from "../../types/Post";

import GradientAvatar from "../../layouts/GradientAvatar/GradientAvatar";
import Button from "../../layouts/Button/Button";
import BioWithToggle from "./BioWithToggle/BioWithToggle";
import ProfilePosts from "./ProfilePosts/ProfilePosts";

import styles from "./Profile.module.css";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const navigate = useNavigate();

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { isFollowing, handleFollow, handleUnfollow, isProcessing } = useFollow(
    user,
    setUser
  );

  useEffect(() => {
    if (!username) return;
    getPostsByUsername(username).then(setPosts).catch(console.error);
  }, [username]);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const freshUser = await getUserByUsername(username);
        setUser(freshUser);
      } catch (err) {
        console.error("Ошибка при загрузке профиля:", err);
      }
    };

    fetchUser();
  }, [username, currentUser]);

  if (!user) return <p>Loading...</p>;

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
