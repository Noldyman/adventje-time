import { validate } from "./validate";
import { requiredString, password } from "./validators";

const schema = {
  oldPassword: requiredString,
  password,
};

export const validateNewPassword = (input: {}) => validate(input, schema);
