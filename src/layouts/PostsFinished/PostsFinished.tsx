import React from "react";

import styles from "./PostsFinished.module.css";

const PostsFinished: React.FC = () => {
  return (
    <div className={styles.container}>
      <img
        src="/illo-confirm-refresh-light.png"
        alt="End of feed"
        className={styles.icon}
      />
      <p className={styles.smallText}>You've seen all the updates</p>
      <p className={styles.mainText}>You have viewed all new publications</p>
    </div>
  );
};

export default PostsFinished;
