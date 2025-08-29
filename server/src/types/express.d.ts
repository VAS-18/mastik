import { Request } from 'express';

interface UserPayload {
  id: string;
}


declare global {
  namespace Express {
    export interface Request {
      user?: UserPayload; 
    }
  }
}
