import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';
import { checkSchema } from 'express-validator';
import AuthValSchema from '../validators/auth.validator';

class AuthRoute {
  public router: Router = Router();
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController(new AuthService());
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/register', checkSchema(AuthValSchema.register), (req: Request, res: Response) => {
      this.authController.register(req, res);
    });

    this.router.post('/login', checkSchema(AuthValSchema.login), (req: Request, res: Response) => {
      this.authController.login(req, res);
    });
  }
}

export default new AuthRoute().router;
