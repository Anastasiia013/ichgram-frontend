import { useEffect } from "react";
import { useWatch } from "react-hook-form";
import type {
  UseFormSetError,
  UseFormClearErrors,
  Control,
} from "react-hook-form";
import debounce from "lodash.debounce";

interface Props {
  control: Control<any>;
  setError: UseFormSetError<any>;
  clearErrors: UseFormClearErrors<any>;
}

const useFieldValidation = ({ control, setError, clearErrors }: Props) => {
  const email = useWatch({ control, name: "email" });
  const username = useWatch({ control, name: "username" });

  useEffect(() => {
    const validateFields = async () => {
      if (email) {
        try {
          const res = await fetch(
            `/api/users/check-email?email=${encodeURIComponent(email)}`
          );
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data.exists) {
              setError("email", {
                type: "manual",
                message: "Email is already registered",
              });
            } else {
              clearErrors("email");
            }
          } catch {
            console.error("Не удалось распарсить JSON в check-email");
          }
        } catch (err) {
          console.error("Ошибка при запросе check-email", err);
        }
      } else {
        clearErrors("email");
      }

      if (username) {
        try {
          const res = await fetch(
            `/api/users/check-username?username=${encodeURIComponent(username)}`
          );
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            if (data.exists) {
              setError("username", {
                type: "manual",
                message: "Username is taken",
              });
            } else {
              clearErrors("username");
            }
          } catch {
            console.error("Не удалось распарсить JSON в check-username");
          }
        } catch (err) {
          console.error("Ошибка при запросе check-username", err);
        }
      } else {
        clearErrors("username");
      }
    };

    const debounced = debounce(validateFields, 500);
    debounced();

    return () => {
      debounced.cancel();
    };
  }, [email, username, setError, clearErrors]);
};

export default useFieldValidation;
