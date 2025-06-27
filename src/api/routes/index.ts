import { Router, Request, Response, NextFunction } from 'express';
import { AuthenticateRequest } from '../../middleware/authenticate-request';
import AuthRoute from './auth.route';
import UsersRoute from './users.route';
import PostsRoute from './posts.route';

export class Routes {
  private authenticate: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;

  constructor() {
    const authMiddleware = new AuthenticateRequest();
    // We must bind the method to its instance to preserve the `this` context
    // when Express calls it as a middleware function.
    this.authenticate = authMiddleware.validate.bind(authMiddleware);
  }

  public routes(router: Router) {
    // Unprotected authentication routes, using a clear `/auth` prefix.
    router.use('/', AuthRoute);

    // Protected routes that require token validation.
    router.use('/users', this.authenticate, UsersRoute);
    router.use('/posts', this.authenticate, PostsRoute);
  }
}
