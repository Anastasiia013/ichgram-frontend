import * as Yup from "yup";

import {
  passwordSchema,
  usernameSchema,
  emailSchema,
} from "../../../../shared/utils/validation";

const loginSchema = Yup.object({
  identifier: Yup.string()
    .required("Email or Username is required")
    .test(
      "is-email-or-username",
      "Must be a valid email or username",
      function (value) {
        if (!value) return false;

        const isEmail = emailSchema.isValidSync(value);
        const isUsername = usernameSchema.isValidSync(value);

        return isEmail || isUsername;
      }
    ),
  password: passwordSchema,
});

export default loginSchema;
