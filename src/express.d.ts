import { JwtPayload } from 'jsonwebtoken';

// Define a more specific type for the user object you're attaching to the request
export interface UserPayload extends JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
    token?: string;
  }
} 