import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

import PostComponent from "../../layouts/Post/PostComponent"
import PostsFinished from "../../layouts/PostsFinished/PostsFinished";

import { getFeedPosts } from "../../shared/api/posts-api";

import styles from "./MainPage.module.css";

const MainPage = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;

    async function fetchPosts() {
      try {
        const data = await getFeedPosts(token);
        setPosts(data);
      } catch (error) {
        console.error("Ошибка загрузки постов:", error);
      }
    }

    fetchPosts();
  }, [token]);

  const handlePostUpdate = (updatedPost: any) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  return (
    <>
      <div className={styles.postsBox}>
        {posts.map((post) => (
          <PostComponent key={post._id} post={post} onPostUpdate={handlePostUpdate} />
        ))}
      </div>
      <PostsFinished />
    </>
  );
};

export default MainPage;
