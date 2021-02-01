import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { JwtConfig } from '../config';
import AppError from '../errors/AppErrors';

export default async function authorizedEndPoint(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) throw new AppError('Unauthorized', 401);
    if (token) JWT.verify(token, JwtConfig.secret);
    next();
  } catch (error) {
    throw new AppError('Unauthorized', 401);
  }
}
