import * as yup from "yup";

export const email = yup
  .string()
  .email("Must be a valid email address")
  .max(100, "Max 100 characters allowed")
  .required("Email address is required");

export const firstName = yup
  .string()
  .max(20, "Max 20 characters allowed")
  .required("First name is required");

export const password = yup
  .string()
  .matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Must contain at least one lowercase letter, one uppercase letter, one number and one special character"
  )
  .min(8, "Must contain at least 8 characters")
  .max(50, "Max 50 charactars allowed")
  .required("Password is required");

export const oldPassword = yup
  .string()
  .max(50, "Max 50 charactars allowed")
  .required("Required");
