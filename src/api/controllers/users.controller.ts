import { Request, Response } from 'express';
import { validationResult } from 'express-validator/lib';
import { HTTP_STATUS } from "../../config/http-status";
import { UserService } from "../../services/user.service";
import { MESSAGES } from '../../utils/messages';
import { ResponseParser } from '../../utils/response-parser';
import { UserPayload } from 'user.types';

export class UsersController {
  constructor(private readonly userService: UserService) {}

  public async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers(req.token);

    if (!users) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.NOT_FOUND)
        .setStatus(false)
        .setMessage(MESSAGES.USER_NOT_FOUND);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setMessage(MESSAGES.USERS_FETCHED)
      .setBody(users);

    return responseParser.send(res);
  }

  public async getUserDetails(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.BAD_REQUEST)
        .setStatus(false)
        .setMessage(MESSAGES.VALIDATION_ERROR)
        .setBody(errors);

      return responseParser.send(res);
    }

    const userId = req.params.id;
    const userTokenDecoded = req.user as UserPayload;
    const user = await this.userService.getUserDetails(userId, userTokenDecoded);
    
    if (!user) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.NOT_FOUND)
        .setStatus(false)
        .setMessage(MESSAGES.USER_NOT_FOUND);

      return responseParser.send(res);
    }

    if ('error' in user) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.UNAUTHORIZED)
        .setStatus(false)
        .setMessage(user.error);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setMessage(MESSAGES.USER_DETAILS_FETCHED)
      .setBody(user);

    return responseParser.send(res);
  }

  public async deleteUser(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.BAD_REQUEST)
        .setStatus(false)
        .setMessage(MESSAGES.VALIDATION_ERROR)
        .setBody(errors);

      return responseParser.send(res);
    }

    const userId = req.params.id;
    const userTokenDecoded = req.user as UserPayload;
    const deletedUser = await this.userService.deleteUser(userId, userTokenDecoded);

    if (!deletedUser) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.NOT_FOUND)
        .setStatus(false)
        .setMessage(MESSAGES.USER_NOT_FOUND);

      return responseParser.send(res);
    }

    if ('error' in deletedUser) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.UNAUTHORIZED)
        .setStatus(false)
        .setMessage(deletedUser.error);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setMessage(MESSAGES.USER_DELETED)
      .setBody(deletedUser);

    return responseParser.send(res);
  }
}
