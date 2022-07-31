import { validate } from "./validate";
import { email, firstName, password } from "./validators";

const schema = {
  email,
  firstName,
  password,
};

export const validateNewAccount = (input: {}) => validate(input, schema);
