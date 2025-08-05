import * as Yup from "yup";

export const emailValidation = {
  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  message: "Email must contain @, dot and no spaces",
};

export const passwordValidation = {
  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]+$/,
  message:
    "Password must contain at least 1 letter, 1 number and 1 special symbol",
};

export const passwordSchema: Yup.StringSchema<string> = Yup.string()
  .trim()
  .min(6, "Password must be at least 6 characters")
  .matches(passwordValidation.value, passwordValidation.message)
  .required("Password is required");

export const emailSchema = Yup.string()
  .trim()
  .matches(emailValidation.value, emailValidation.message)
  .required("Email is required");

export const usernameSchema = Yup.string()
  .trim()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .matches(
    /^[a-zA-Z0-9_]+$/,
    "Username can only contain letters, numbers and underscores"
  );
