import 'dotenv/config';
import express from 'express';
import { AppDataSource } from './database/appDataSource';
import { Routes } from './api/routes';

const port = process.env.PORT;

const app = express();

// Middleware
app.use(express.json());

// ROUTES
const apiRouter = express.Router();
new Routes().routes(apiRouter);
app.use('/api', apiRouter);

// initialize DB with TypeORM
AppDataSource.initialize().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}).catch((error) => {
  console.error('Error connecting to the database', error);
});
