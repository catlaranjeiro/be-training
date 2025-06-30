import { Request, Response } from 'express';
import { HTTP_STATUS } from '../../config/http-status';
import { AuthService } from '../../services/auth.service';
import { MESSAGES } from '../../utils/messages';
import { validationResult } from 'express-validator';

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
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: result,
      });
    }

    return res.status(HTTP_STATUS.CREATED).json({
      status: 'success',
      message: MESSAGES.USER_CREATED,
      data: result,
    });
  }

  public async login(req: Request, res: Response) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        status: 'error',
        message: errors,
      });
    }

    const result = await this.authService.login(req.body.email, req.body.password);
    
    if (result === MESSAGES.INVALID_CREDENTIALS) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: result,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      status: 'success',
      data: result,
    });
  }
}
