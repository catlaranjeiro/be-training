import { Router, json, Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { timeLog } from '../utils/timelog';
import ArticlesValSchema from '../validation/articles-validation';
import client from '../db';

const articlesRouter = Router({ mergeParams: true });

articlesRouter.use(json());
articlesRouter.use(timeLog); // this prints the time of the request for all requests to this router

articlesRouter
  .route('/')
  .get((req, res) => {
    const getAllQuery = 'SELECT * FROM articles';
    client.query(getAllQuery, (err, result) => {
      if (err) {
        res.status(404).json({ status: 'error', message: err.message });
        return;
      }
      const response = {
        status: 'success',
        data: result.rows,
      };
      res.status(200).json(response);
    });
  })
  .post(
    checkSchema(ArticlesValSchema.create),
    (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', errors: errors });
        return;
      }

      const insertArticleQuery =
        'INSERT INTO articles (id, title, description, article) VALUES ($1, $2, $3, $4) RETURNING *';

      const newArticle = [
        Math.floor(Math.random() * 1000),
        req.body.title,
        req.body.description,
        req.body.article,
      ];

      client.query(insertArticleQuery, newArticle, (err, result) => {
        if (err) {
          res.status(500).json({ status: 'error', message: err.message });
          return;
        }

        const response = {
          status: 'success',
          data: result.rows,
        };
        res.status(201).json(response);
      });
    },
  );

articlesRouter
  .route('/:id')
  .get((req, res) => {
    const articleId = parseInt(req.params.id);
    const getArticleIdQuery = 'SELECT * FROM articles WHERE id = $1';

    client.query(getArticleIdQuery, [articleId], (err, result) => {
      if (err) {
        res.status(500).json({ status: 'error', message: err.message });
        return;
      }

      if (result.rows.length === 0) {
        res.status(404).json({ status: 'error', message: 'Article not found' });
        return;
      }

      const response = {
        status: 'success',
        data: result.rows,
      };
      res.status(200).json(response);
    });
  })
  .put(checkSchema(ArticlesValSchema.edit), (req: Request, res: Response) => {
    const articleId = parseInt(req.params.id);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ status: 'error', errors: errors });
      return;
    }

    const fieldsToUpdate = [];
    const values = [articleId];

    if (req.body.title) {
      fieldsToUpdate.push('title = $' + (fieldsToUpdate.length + 2));
      values.push(req.body.title);
    }
    if (req.body.description) {
      fieldsToUpdate.push('description = $' + (fieldsToUpdate.length + 2));
      values.push(req.body.description);
    }
    if (req.body.article) {
      fieldsToUpdate.push('article = $' + (fieldsToUpdate.length + 2));
      values.push(req.body.article);
    }

    if (fieldsToUpdate.length === 0) {
      res.status(400).json({ status: 'error', message: 'No fields to update' });
      return;
    }

    const updateArticleQuery = `UPDATE articles SET ${fieldsToUpdate.join(
      ', ',
    )} WHERE id = $1 RETURNING *`;

    client.query(updateArticleQuery, values, (err, result) => {
      if (err) {
        res.status(500).json({ status: 'error', message: err.message });
        return;
      }

      const response = {
        status: 'success',
        data: result.rows,
      };
      res.status(200).json(response);
    });
  })
  .delete((req, res) => {
    const articleId = parseInt(req.params.id);
    const deleteArticleQuery = 'DELETE FROM articles WHERE id = $1';

    client.query(deleteArticleQuery, [articleId], (err, result) => {
      if (err) {
        res.status(500).json({ status: 'error', message: err.message });
        return;
      }

      const response = {
        status: 'success',
        data: result.rows,
      };
      res.status(200).json(response);
    });
  });

export default articlesRouter;
