import { Request, Response } from 'express';
import { HTTP_STATUS } from "../../config/http-status";
import { UserService } from "../../services/user.service";
import { MESSAGES } from '../../utils/messages';

export class UsersController {
  constructor(private readonly userService: UserService) {}

  public async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers(req.token);

    if (!users) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: MESSAGES.USER_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: users,
    });
  }

  public async getUserDetails(req: Request, res: Response) {
    const userId = req.params.id;
    const user = await this.userService.getUserDetails(userId);
    
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: MESSAGES.USER_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: user,
    });
  }

  public async deleteUser(req: Request, res: Response) {
    const userId = req.params.id;
    const deletedUser = await this.userService.deleteUser(userId);

    if (!deletedUser) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        status: 'error',
        message: MESSAGES.USER_NOT_FOUND,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      message: MESSAGES.USER_DELETED,
      data: deletedUser,
    });
  }
}
