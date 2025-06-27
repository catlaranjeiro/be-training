import { UserPayload } from './types/user.types';
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
    token?: string;
  }
} 