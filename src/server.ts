import express from 'express';
import articlesRouter from './routes/articles';

const app = express();
const port = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/articles', articlesRouter);

app.listen(port, () => {
  console.log(`BE-training listening on port ${port}`);
});
