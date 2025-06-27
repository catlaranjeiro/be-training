import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload extends JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
} 