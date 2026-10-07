import dotenv from 'dotenv';
import { type StringValue } from 'ms';

dotenv.config();

type Options<T> = {
  required?: boolean;
  default?: T | undefined;
};
const getEnvVariable = <T>(
  key: string,
  options: Options<T> = { required: true, default: undefined },
): T => {
  const value = process.env[key] || options.default;

  if (!value && options.required) {
    console.error(`ENVIRONMENT_VARIABLE: ${key} not found.`);
    return process.exit(1);
  }

  return value as T;
};

