import { Client } from 'pg';

export const client = new Client({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  port: parseInt(process.env.DB_PORT as string) || 5432,
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'blog-test',
});

client.connect().then(() => console.log(`Connected to database ${process.env.DB_NAME}`));

export default client;