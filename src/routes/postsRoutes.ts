import { Router, json, Request, Response, NextFunction } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { timeLog } from '../utils/timelog';
import PostsValSchema from '../validation/posts-validation';
import { AppDataSource } from '../database/appDataSource';
import { PostEntity } from '../database/entity/PostEntity';
import { UserEntity } from '../database/entity/UserEntity';
import { authenticateToken, authenticateTokenMiddleware } from '../middleware/authenticate-token';

const postsRouter = Router({ mergeParams: true });
const postsRepository = AppDataSource.getRepository(PostEntity);
const usersRepository = AppDataSource.getRepository(UserEntity);

postsRouter.use(json());
postsRouter.use(timeLog); // this prints the time of the request for all requests to this router

postsRouter
  .route('/')
  .get(authenticateTokenMiddleware, async (req: Request, res: Response) => {
    const allPosts = await postsRepository.find({
      relations: { author: true },
    });

    res.status(200).json({ status: 'success', data: allPosts });
  })
  .post(
    authenticateTokenMiddleware,
    checkSchema(PostsValSchema.create),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', errors: errors });
        return;
      }

      const { title, description, text, authorId, tags } = req.body;

      // Find author by id
      const author = await usersRepository.findOneBy({ id: authorId });

      if (!author) {
        res.status(404).json({ status: 'error', message: 'Author not found' });
        return;
      }

      // Assert req.user is defined and has the expected type (UserPayload)
      // The authenticateTokenMiddleware ensures that req.user is set.
      if (author.id !== req.user!.id) {
        res.status(403).json({ status: 'error', message: 'You are not authorized to create a post for this author' });
        return;
      }

      const newPost = Object.assign(new PostEntity(), {
        title,
        description,
        text,
        tags: tags || [],
        author,
        publishedAt: new Date(),
      });

      const result = await postsRepository.save(newPost);

      res.status(200).json({ status: 'success', data: result });
    },
  );

postsRouter
  .route('/:id')
  .get(authenticateTokenMiddleware, async (req, res) => {
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
    authenticateTokenMiddleware,
    checkSchema(PostsValSchema.edit),
    async (req: Request, res: Response) => {
      const postId = req.params.id;
      const errors = validationResult(req);

      const { title, description, text, tags } = req.body;

      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', errors: errors });
        return;
      }

      const postData = await postsRepository.findOneBy({ id: postId });

      if (!postData) {
        res.status(404).json({ status: 'error', message: 'Post not found' });
        return;
      }

      if (postData?.author?.id !== req.user!.id) {
        res.status(403).json({ status: 'error', message: 'You are not authorized to update this post' });
        return;
      }

      const updatedPost = postsRepository.update(
        { id: postId },
        { title, description, text, tags: tags || [] },
      );

      res.status(200).json({ status: 'success', data: updatedPost });
    },
  )
  .delete(authenticateTokenMiddleware, async (req, res) => {
    const postId = req.params.id;

    const postData = await postsRepository.findOneBy({ id: postId });

    if (!postData) {
      res.status(404).json({ status: 'error', message: 'Post not found' });
      return;
    }

    if (postData?.author?.id !== req.user!.id) {
      res.status(403).json({ status: 'error', message: 'You are not authorized to delete this post' });
      return;
    }

    postsRepository.delete({ id: postId });

    res.status(200).json({
      status: 'success',
      data: { message: 'Post successfully deleted!' },
    });
  });

export default postsRouter;
