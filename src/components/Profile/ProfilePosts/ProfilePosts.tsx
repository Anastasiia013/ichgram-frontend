import { Link, useLocation } from "react-router-dom";
import type { Post } from "../../../types/Post";

import styles from "./ProfilePosts.module.css";

interface Props {
  posts: Post[];
}

export default function ProfilePosts({ posts }: Props) {
  const location = useLocation();

  if (!posts.length) {
    return <p>У пользователя пока нет постов</p>;
  }

  return (
    <div className={styles.postGrid}>
      {posts.map((post) => (
        <div key={post._id} className={styles.postItem}>
          <Link
            to={`/posts/${post._id}`}
            state={{ background: location }}
          >
            <img src={post.imageUrl} alt="Post" />
          </Link>
        </div>
      ))}
    </div>
  );
}
