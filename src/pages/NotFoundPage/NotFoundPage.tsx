import styles from "./NotFoundPage.module.css";

const NotFoundPage = () => {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.notFoundContainer}>
          <div className={styles.imageSection}>
            <img
              src="/login-image.png"
              alt="App preview"
              className={styles.previewImage}
            />
          </div>
          <div className={styles.notFoundText}>
            <h1>Oops! Page Not Found (404 Error)</h1>
            <p className={styles.notFoundParagraph}>
              We're sorry, but the page you're looking for doesn't seem to
              exist. If you typed the URL manually, please double-check the
              spelling. If you clicked on a link, it may be outdated or broken.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
