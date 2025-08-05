import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { sendResetLinkApi } from "../../../shared/api/register-api";

import Button from "../../../layouts/Button/Button";
import TextField from "../../../layouts/TextField/TextField";

import styles from "../Authentificate.module.css";

const ForgotPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    try {
      await sendResetLinkApi(data.identifier);
      navigate("/forgot-password/complete");
    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong";
      setError("identifier", { type: "manual", message });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.card}>
          <img src="/forgot-password.svg" alt="" />
          <p className={styles.subtitleBlack}>Trouble logging in?</p>
          <h5>
            Enter your email, phone, or username and we'll send you a link to
            get back into your account.
          </h5>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <TextField
              placeholder="Email or Username"
              {...register("identifier", {
                required: "Field is required",
              })}
            />
            {typeof errors.identifier?.message === "string" && (
              <p className="errorMessage">{errors.identifier.message}</p>
            )}

            <Button type="submit" text="Reset your password" />
          </form>

          <div className={styles.separatorContainer}>
            <div className={styles.separator}></div>
            <span className={styles.orText}>OR</span>
            <div className={styles.separator}></div>
          </div>

          <div className={styles.linkWithoutBorder}>
            <a href="/signup" className={styles.backToLoginLink}>
              Create new account
            </a>
          </div>
        </div>
        <div className={styles.backToLogin}>
          <a href="/" className={styles.backToLoginLink}>
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
