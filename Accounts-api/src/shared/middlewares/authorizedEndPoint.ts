import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { JwtConfig } from '../config';
import AppError from '../errors/AppErrors';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
}

export default async function authorizedEndPoint(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) throw new AppError('Unauthorized', 401);
    if (token) {
      req.currentUser = JWT.verify(token, JwtConfig.secret) as CurrentUser;
    }
    next();
  } catch (error) {
    throw new AppError('Unauthorized', 401);
  }
}
