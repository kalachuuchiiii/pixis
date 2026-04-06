import dotenv from 'dotenv';
import logger from './logger';
import ms, { type StringValue } from 'ms';

dotenv.config();

type Options = {
  required?: boolean;
};
const getEnvVariable = (key: string, options: Options = { required: true }) => {
  const value = process.env[key];

  if (!value && options.required) {
    logger.error(`ENVIRONMENT_VARIABLE: ${key} not found.`);
    return process.exit(1);
  }

  return value;
};

const env = {
  DB_NAME: getEnvVariable('DB_NAME') as string,
  DB_PASS: getEnvVariable('DB_PASS') as string,
  DB_PORT: Number(getEnvVariable('DB_PORT')),
  DB_USER: getEnvVariable('DB_USER') as string,
  DB_HOST: getEnvVariable('DB_HOST') as string,
  NODE_ENV: getEnvVariable('NODE_ENV') as string,
  ACCESS_TOKEN_SECRET: getEnvVariable('ACCESS_TOKEN_SECRET') as string,
  ACCESS_TOKEN_TTL: getEnvVariable('ACCESS_TOKEN_TTL') as StringValue,
  REFRESH_TOKEN_SECRET: getEnvVariable('REFRESH_TOKEN_SECRET') as string,
  REFRESH_TOKEN_TTL: getEnvVariable('REFRESH_TOKEN_TTL') as StringValue,
};

export default env;
