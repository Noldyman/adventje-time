import * as yup from "yup";

export const requiredString = yup.string().required("Required");

export const email = yup
  .string()
  .email("Must be a valid email address")
  .max(100, "Max 100 charactars allowed")
  .required("Email address is required");

export const password = yup
  .string()
  .matches(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Must contain at least one lowercase letter, one uppercase letter, one number and one special character"
  )
  .min(8, "Must contain at least 8 characters")
  .max(50, "Max 50 charactars allowed")
  .required("Password is required");
