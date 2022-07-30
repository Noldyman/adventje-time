import { validate } from "./validate";
import { email, password } from "./validators";

const schema = {
  email,
  password,
};

export const validateNewAccount = (input: {}) => validate(input, schema);
