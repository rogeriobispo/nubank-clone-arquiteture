import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { ExternalApi } from '../config';
import AppError from '../errors/AppErrors';

const api = axios.create({
  baseURL: ExternalApi.authApiBaseUrl,
});
export default async function authorizedEndPoint(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers?.authorization?.split(' ')[1];
    if (!token) throw new AppError('Unauthorized', 401);
    if (token) {
      await api.get(`/authorized/${token}`);
    }
    next();
  } catch (error) {
    throw new AppError('Unauthorized', 401);
  }
}
