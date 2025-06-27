import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../types/user.types';
import { HTTP_STATUS } from '../config/http-status';
import { MESSAGES } from '../utils/messages';

export class AuthenticateRequest {
  public async validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
        return;
      }

      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string,
      );

      // We must ensure the decoded payload is an object, not a string.
      if (typeof decoded === 'string') {
        res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.INVALID_TOKEN });
        return;
      }

      req.user = decoded as UserPayload;
      next();
    } catch (error) {
      // This will catch any error from jwt.verify, like an expired token.
      res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED });
    }
  }
}