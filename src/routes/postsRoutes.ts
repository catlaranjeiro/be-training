import { Router, json, Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { timeLog } from '../utils/timelog';
import PostsValSchema from '../validation/posts-validation';
import { AppDataSource } from '../database/appDataSource';
import { PostEntity } from '../database/entity/PostEntity';
import { UserEntity } from '../database/entity/UserEntity';

const postsRouter = Router({ mergeParams: true });
const postsRepository = AppDataSource.getRepository(PostEntity);
const usersRepository = AppDataSource.getRepository(UserEntity);

postsRouter.use(json());
postsRouter.use(timeLog); // this prints the time of the request for all requests to this router

postsRouter
  .route('/')
  .get(async (req, res) => {
    const allPosts = await postsRepository.find({
      relations: { author: true },
    });

    res.status(200).json({ status: 'success', data: allPosts });
  })
  .post(
    checkSchema(PostsValSchema.create),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', errors: errors });
        return;
      }

      const { title, description, text, authorId } = req.body;

      // Find author by id
      const author = await usersRepository.findOneBy({ id: authorId });

      if (!author) {
        res.status(404).json({ status: 'error', message: 'Author not found' });
        return;
      }

      const newPost = new PostEntity();
      newPost.title = title;
      newPost.description = description;
      newPost.text = text;
      newPost.author = author;
      newPost.publishedAt = new Date();

      const result = await postsRepository.save(newPost);

      res.status(200).json({ status: 'success', data: result });
    },
  );

postsRouter
  .route('/:id')
  .get(async (req, res) => {
    const postId = req.params.id;

    const postData = await postsRepository.findOne({
      where: { id: postId },
      relations: { author: true },
    });

    if (!postData) {
      res.status(404).json({ status: 'error', message: 'Post not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: postData });
  })
  .put(
    checkSchema(PostsValSchema.edit),
    async (req: Request, res: Response) => {
      const postId = req.params.id;
      const errors = validationResult(req);

      const { title, description, text } = req.body;

      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', errors: errors });
        return;
      }

      const postData = await postsRepository.findOneBy({ id: postId });

      if (!postData) {
        res.status(404).json({ status: 'error', message: 'Post not found' });
        return;
      }

      const updatedPost = postsRepository.update(
        { id: postId },
        { title, description, text },
      );

      res.status(200).json({ status: 'success', data: updatedPost });
    },
  )
  .delete(async (req, res) => {
    const postId = req.params.id;

    const postData = await postsRepository.findOneBy({ id: postId });

    if (!postData) {
      res.status(404).json({ status: 'error', message: 'Post not found' });
      return;
    }

    postsRepository.delete({ id: postId });

    res.status(200).json({
      status: 'success',
      data: { message: 'Post successfully deleted!' },
    });
  });

export default postsRouter;
