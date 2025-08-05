import * as Yup from "yup";

import {
  passwordSchema,
  emailSchema,
} from "../../../../shared/utils/validation";

export interface SignupFormInputs {
  email: string;
  fullname: string;
  username: string;
  password: string;
}

const signupSchema: Yup.ObjectSchema<SignupFormInputs> = Yup.object({
  email: emailSchema,
  fullname: Yup.string()
    .trim()
    .min(2, "Fullname must be at least 2 characters")
    .max(50, "Fullname must be at most 50 characters")
    .required("Fullname is required"),
  username: Yup.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .matches(
      /^[a-zA-Z0-9_.]+$/,
      "Only letters, numbers, underscores and dots allowed"
    )
    .required("Username is required"),
  password: passwordSchema,
});

export default signupSchema;
