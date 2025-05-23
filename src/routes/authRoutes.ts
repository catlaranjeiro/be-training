import 'dotenv';
import { Router, json, Request, Response, NextFunction } from 'express';
import { checkSchema, validationResult } from 'express-validator';
import { timeLog } from '../utils/timelog';
import { AppDataSource } from '../database/appDataSource';
import { UserEntity } from '../database/entity/UserEntity';
import AuthValSchema from '../validation/auth-validation';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authRouter = Router({ mergeParams: true });
const usersRepository = AppDataSource.getRepository(UserEntity);

authRouter.use(json());
authRouter.use(timeLog); // this prints the time of the request for all requests to this router

authRouter
  .route('/signup')
  .post(
    checkSchema(AuthValSchema.signup),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', errors: errors });
        return;
      }

      const { firstName, lastName, email, password } = req.body;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = Object.assign(new UserEntity(), {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const result = await usersRepository.save(newUser);

      if (!result) {
        res.status(500).json({ status: 'error', message: 'User not created' });
        return;
      }

      res.status(200).json({ status: 'success', data: result });
    },
  );

authRouter
  .route('/login')
  .post(
    checkSchema(AuthValSchema.login),
    async (req: Request, res: Response) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', errors: errors });
        return;
      }

      const { email, password } = req.body;

      const user = await usersRepository
        .createQueryBuilder('user')
        .addSelect('user.password') // need to explicitly select the password to compare it, because we don't select it by default on UserEntity
        .where('user.email = :email', { email })
        .getOne();

      if (!user) {
        res
          .status(401)
          .json({ status: 'error', message: 'Invalid credentials' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res
          .status(401)
          .json({ status: 'error', message: 'Invalid credentials' });
        return;
      }

      const userObj = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }

      const token = jwt.sign(
        userObj,
          process.env.ACCESS_TOKEN_SECRET as string,
        {
          expiresIn: '1h',
        },
      );

      res.status(200).json({ status: 'success', data: { token, user: userObj }});
    },
  );

export default authRouter;
