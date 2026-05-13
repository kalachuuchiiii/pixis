import 'reflect-metadata';
import { DataSource } from 'typeorm';
import 'dotenv/config';

const isProd = process.env.NODE_ENV === 'production';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST as string,
  schema: 'public',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER as string,
  password: process.env.DB_PASS as string,
  database: process.env.DB_NAME as string,
  migrations: ['dist/src/migrations/*.js'],
  entities: [`dist/src/modules/**/entities/*.entity.js`],
  synchronize: false,
  logging: !isProd,
});

export default AppDataSource;
