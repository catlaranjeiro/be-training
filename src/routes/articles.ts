import { Router, json } from 'express';
import { timeLog } from '../utils/timelog';

const articlesRouter = Router({ mergeParams: true });

articlesRouter.use(json());
articlesRouter.use(timeLog); // this prints the time of the request for all requests to this router

articlesRouter.get('/', (req, res) => {
  res.send('articles here');
});

export default articlesRouter;
