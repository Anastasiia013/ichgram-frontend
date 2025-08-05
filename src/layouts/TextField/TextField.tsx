import React from "react";
import styles from "./TextField.module.css";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        {...rest}
        autoComplete="off"
        className={`${styles.input} ${className || ""}`}
      />
    );
  }
);

TextField.displayName = "TextField";

export default TextField;
