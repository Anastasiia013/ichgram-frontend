import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { resetPasswordApi } from "../../shared/api/register-api";

import styles from "./ResetPasswordPage.module.css";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const verificationCode = searchParams.get("verificationCode");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPasswordApi(verificationCode!, newPassword);
      setMessage("Password successfully reset. Redirecting to login...");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <h2 className={styles.title}>Reset Password</h2>

        {message && (
          <p className={`${styles.message} ${styles.success}`}>{message}</p>
        )}
        {error && (
          <p className={`${styles.message} ${styles.error}`}>{error}</p>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            className={styles.input}
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className={styles.button} type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
