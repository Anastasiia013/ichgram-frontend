import { useEffect, useState } from "react";
import { getExplorePosts } from "../../shared/api/posts-api";
import styles from "./Explore.module.css";

import { useNavigate, useLocation } from "react-router-dom";

interface Post {
  _id: string;
  imageUrl: string;
}

const Explore = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const openPostModal = (postId: string) => {
    navigate(`/posts/${postId}`, { state: { background: location } });
  };

  useEffect(() => {
    getExplorePosts()
      .then((data) => {
        setPosts(data);
      })
      .catch((error) => {
        console.error("Ошибка загрузки постов:", error);
      });
  }, []);

  return (
    <div className={styles.grid}>
      {posts.map((post, index) => (
        <div
          key={post._id}
          className={index % 4 === 2 ? styles.itemWide : styles.itemSquare}
          onClick={() => openPostModal(post._id)}
        >
          <img
            className={styles.postImage}
            src={post.imageUrl}
            alt="explore post"
          />
        </div>
      ))}
    </div>
  );
};

export default Explore;
