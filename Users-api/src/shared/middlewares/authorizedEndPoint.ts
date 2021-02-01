import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { promisify } from 'util';
import { JwtConfig } from '../config';
import AppError from '../errors/AppErrors';

const { secret } = JwtConfig;

export default async function authorizedEndPoint(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const [, token] = req.headers.authorization.split(' ');

    if (!token) res.status(401).json({ error: 'Unauthorized' });

    await promisify(JWT.verify)(token);
    next();
  } catch (error) {
    throw new AppError('Unauthorized', 401);
  }
}
