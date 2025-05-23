import e, { Router, json, Request, Response } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { timeLog } from '../utils/timelog';
import { AppDataSource } from '../database/appDataSource';
import { UserEntity } from '../database/entity/UserEntity';
import { PostEntity } from '../database/entity/PostEntity';
import UsersValSchema from '../validation/auth-validation';

const usersRouter = Router({ mergeParams: true });
const usersRepository = AppDataSource.getRepository(UserEntity);
const postsRepository = AppDataSource.getRepository(PostEntity);

usersRouter.use(json());
usersRouter.use(timeLog); // this prints the time of the request for all requests to this router

usersRouter.route('/').get(async (req, res) => {
  const allUsers = await usersRepository.find();

  res.status(200).json({ status: 'success', data: allUsers });
});
// .post(
//   checkSchema(UsersValSchema.create),
//   async (req: Request, res: Response) => {
//     const errors = validationResult(req);

//     if (!errors.isEmpty()) {
//       res.status(422).json({ status: 'error', errors: errors });
//       return;
//     }

//     const { firstName, lastName, email, password } = req.body;

//     const newUser = Object.assign(new UserEntity(), {
//       firstName,
//       lastName,
//       email,
//       password,
//     });

//     const result = await usersRepository.save(newUser);

//     res.status(200).json({ status: 'success', data: result });
//   },
// );

usersRouter
  .route('/:id')
  .get(async (req, res) => {
    const userId = req.params.id;

    const userData = await usersRepository.findOne({
      where: { id: userId },
      relations: { posts: true },
    });

    if (!userData) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    res.status(200).json({ status: 'success', data: userData });
  })
  .delete(async (req, res) => {
    const userId = req.params.id;

    const userData = await usersRepository.findOneBy({ id: userId });

    if (!userData) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    const posts = await postsRepository.findBy({ author: { id: userId } });

    try {
      if (posts.length > 0) {
        posts.forEach(async post => {
          await postsRepository.delete({ id: post.id });
        });
      }
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'User posts not deleted' });
    }

    try {
      await usersRepository.delete({ id: userId });
      res.status(200).json({
        status: 'success',
        data: { message: 'User successfully deleted!' },
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'User not deleted' });
    }
  });

export default usersRouter;
