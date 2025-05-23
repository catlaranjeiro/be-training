import 'dotenv/config';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Check notes below
  logging: true,
  subscribers: [],
  migrations: ['src/database/migrations/*.ts'],
  entities: ['src/database/entity/*.ts'],
});

/** NOTES **
   * synchronize property automatically creates/updates tables when entities change
   * BENEFITS:
   * - Automatically creates or updates tables when entities change
   * - No need to manually run migrations when modifying entities
   * - Useful for rapid development (especially in local environments)
   * ISSUES:
   * - can cause data loss because it may drop columns or tables when making changes,
   * - not recommended for production as it can lead to unintended schema changes
   * USAGE:
   * - Development: YES // Speeds up development by auto-syncing entities
   * - Testing: YES // Useful for temporary test databases
   * - Production: NO // Risky, may drop tables or columns unexpectedly
   */
