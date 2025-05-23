/// <reference path="../express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from '../express';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Because we will have Bearer token
  
  if (token == null) {
    res.sendStatus(401);
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.user = user as UserPayload;
    next();
  });
}

export const authenticateTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {  
  authenticateToken(req, res, next);
}