import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";

import TextField from "../../../../layouts/TextField/TextField";
import Button from "../../../../layouts/Button/Button";

import loginSchema from "./loginSchema";
import { selectAuth } from "../../../../redux/auth/auth-selectors";

import useFieldValidation from "../../../../shared/hooks/useFieldValidation";

import styles from "../../Authentificate.module.css";

interface LoginFormInputs {
  identifier: string;
  password: string;
}

interface LoginFormProps {
  submitForm: (
    data: LoginFormInputs
  ) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ submitForm }) => {
  const { loading: authLoading } = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    control,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    mode: "onChange",
  });

  useFieldValidation({ control, setError, clearErrors });

  const onSubmit = async (data: LoginFormInputs) => {
    const result = await submitForm(data);

    if (result.success) {
      reset();
    } else if (result.error) {
      const msg = result.error.toLowerCase();
      if (
        msg.includes("identifier") ||
        msg.includes("email") ||
        msg.includes("username")
      ) {
        setError("identifier", { type: "server", message: result.error });
      } else if (msg.includes("password")) {
        setError("password", { type: "server", message: result.error });
      } else {
        setError("identifier", { type: "server", message: result.error });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formfields}>
        <TextField
          placeholder="Email or Username"
          type="text"
          {...register("identifier")}
        />
        {errors.identifier && (
          <p className="errorMessage">{errors.identifier.message}</p>
        )}

        <TextField
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="errorMessage">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        text="Log in"
        color="primary"
        loading={authLoading}
      />

      <div className={styles.separatorContainer}>
        <div className={styles.separator}></div>
        <span className={styles.orText}>OR</span>
        <div className={styles.separator}></div>
      </div>

      <a className={styles.link} href="/forgot-password">
        Forgot password?
      </a>
    </form>
  );
};

export default LoginForm;
