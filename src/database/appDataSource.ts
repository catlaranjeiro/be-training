import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  synchronize: process.env.MODE === 'development',
  logging: true,
  subscribers: [],
  migrations: [],
  entities: ["src/database/Entity/*.ts"],
});