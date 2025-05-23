import 'dotenv/config';
import express from 'express';
import postsRouter from './routes/postsRoutes';
import usersRouter from './routes/usersRoutes';
import { AppDataSource } from './database/appDataSource';
import authRouter from './routes/authRoutes';

const port = process.env.PORT;

const app = express();

// ROUTES
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// initialize DB with TypeORM
AppDataSource.initialize().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}).catch((error) => {
  console.error('Error connecting to the database', error);
});
