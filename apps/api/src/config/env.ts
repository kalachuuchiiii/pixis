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

const env = {
  CORS_ORIGIN: getEnvVariable('CORS_ORIGIN', {
    default: 'http://localhost:5173',
  }),
  DB_NAME: getEnvVariable('DB_NAME') as string,
  DB_PASS: getEnvVariable('DB_PASS') as string,
  DB_PORT: Number(getEnvVariable('DB_PORT')),
  DB_USER: getEnvVariable('DB_USER') as string,
  DB_HOST: getEnvVariable('DB_HOST') as string,
  PROD_DB_HOST: getEnvVariable('PROD_DB_HOST') as string,
  PROD_DB_PASS: getEnvVariable('PROD_DB_PASS') as string,
  PROD_DB_USER: getEnvVariable('PROD_DB_USER') as string,
  PROD_DB_NAME: getEnvVariable('PROD_DB_NAME') as string,
  PROD_DB_PORT: Number(getEnvVariable('PROD_DB_PORT')) as number,
  NODE_ENV: getEnvVariable('NODE_ENV') as
    | 'production'
    | 'development'
    | 'testing',
  ACCESS_TOKEN_SECRET: getEnvVariable('ACCESS_TOKEN_SECRET') as string,
  SSLMODE: getEnvVariable('SSLMODE', { required: false }) as string,
  ACCESS_TOKEN_TTL: getEnvVariable('ACCESS_TOKEN_TTL') as StringValue,
  REFRESH_TOKEN_SECRET: getEnvVariable('REFRESH_TOKEN_SECRET') as string,
  REFRESH_TOKEN_TTL: getEnvVariable('REFRESH_TOKEN_TTL') as StringValue,
  GROQ_API_KEY: getEnvVariable('GROQ_API_KEY') as string,
  CLOUDINARY_CLOUD_NAME: getEnvVariable('CLOUDINARY_CLOUD_NAME') as string,
  CLOUDINARY_API_SECRET: getEnvVariable('CLOUDINARY_API_SECRET') as string,
  CLOUDINARY_API_KEY: getEnvVariable('CLOUDINARY_API_KEY') as string,
};

export default env;
