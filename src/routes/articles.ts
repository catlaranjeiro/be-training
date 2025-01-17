import { Router, json, Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { timeLog } from '../utils/timelog';
import { allArticles } from '../utils/mockedData';
import ArticlesValSchema from '../validation/articles-validation';

const articlesRouter = Router({ mergeParams: true });

articlesRouter.use(json());
articlesRouter.use(timeLog); // this prints the time of the request for all requests to this router

articlesRouter
  .route('/')
  .get((req, res) => {
    const response = {
      status: 'success',
      data: allArticles,
    };
    res.status(200).json(response);
  })
  .post(
    checkSchema(ArticlesValSchema.create),
    (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', errors: errors });
        return;
      }

      const newArticle = {
        id: Math.floor(Math.random() * 1000),
        ...req.body,
      };
      const response = {
        status: 'success',
        data: newArticle,
      };
      res.status(201).json(response);
    },
  );

articlesRouter.put(
  '/:id',
  checkSchema(ArticlesValSchema.edit),
  (req: Request, res: Response) => {
    const articleId = parseInt(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ status: 'error', errors: errors });
      return;
    }

    const existingArticle = allArticles.find(
      article => article.id === articleId,
    );

    if (!existingArticle) {
      res.status(404).json({ status: 'error', message: 'Article not found' });
      return;
    }

    const updatedArticle = {
      ...existingArticle,
      ...req.body,
    };

    const response = {
      status: 'success',
      data: updatedArticle,
    };
    res.status(200).json(response);
  },
);

export default articlesRouter;
