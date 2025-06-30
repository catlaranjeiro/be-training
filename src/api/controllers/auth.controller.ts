import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../config/http-status';
import { AuthService } from '../../services/auth.service';
import { MESSAGES } from '../../utils/messages';
import { validationResult } from 'express-validator';
import { ResponseParser } from '../../utils/response-parser';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  public async register(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: errors,
      });
    }

    const result = await this.authService.register(req.body);

    if (result === MESSAGES.USER_ALREADY_EXISTS) {
      const responseParser = new ResponseParser();
      
      responseParser
        .setHttpCode(HTTP_STATUS.BAD_REQUEST)
        .setStatus(false)
        .setMessage(result);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setHttpCode(HTTP_STATUS.CREATED)
      .setStatus(true)
      .setMessage(MESSAGES.USER_CREATED)
      .setBody(result);

    return responseParser.send(res);
  }

  public async login(req: Request, res: Response) {
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

    const result = await this.authService.login(
      req.body.email,
      req.body.password,
    );

    if (result === MESSAGES.INVALID_CREDENTIALS) {
      const responseParser = new ResponseParser();
      responseParser
        .setHttpCode(HTTP_STATUS.UNAUTHORIZED)
        .setStatus(false)
        .setMessage(result);

      return responseParser.send(res);
    }

    const responseParser = new ResponseParser();
    responseParser
      .setMessage(MESSAGES.LOGIN_SUCCESS)
      .setBody(result);

    return responseParser.send(res);
  }
}
