import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';
const AppDataSource = new DataSource({
  type: 'postgres',
  host: (isProd ? process.env.PROD_DB_HOST : process.env.DB_HOST) as string,
  schema: 'public',
  port: isProd ? Number(process.env.PROD_DB_PORT) : Number(process.env.DB_PORT),
  username: (isProd ? process.env.PROD_DB_USER : process.env.DB_USER) as string,
  password: (isProd ? process.env.PROD_DB_PASS : process.env.DB_PASS) as string,
  database: (isProd ? process.env.PROD_DB_NAME : process.env.DB_NAME) as string,
  migrations: ['dist/src/migrations/*.js'],
  entities: [`dist/src/modules/**/entities/*.entity.js`],
  synchronize: false,
  logging: !isProd,
});

export default AppDataSource;
