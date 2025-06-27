import { Router, Request, Response } from 'express';
import { UsersController } from '../controllers/users.controller';
import { UserService } from '../../services/user.service';

class UsersRoute {
  public router: Router = Router();
  private usersController: UsersController;

  constructor() {
    this.usersController = new UsersController(new UserService());
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/', (req: Request, res: Response) => {
      console.log('req', req.headers)
      this.usersController.getAllUsers(req, res);
    });

    this.router.get('/:id', (req: Request, res: Response) => {
      this.usersController.getUserDetails(req, res);
    });

    this.router.delete('/:id', (req: Request, res: Response) => {
      this.usersController.deleteUser(req, res);
    });
  }
}

export default new UsersRoute().router;
