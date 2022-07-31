import { validate } from "./validate";
import { firstName } from "./validators";

const schema = {
  firstName,
};

export const validateProfile = (input: {}) => validate(input, schema);
