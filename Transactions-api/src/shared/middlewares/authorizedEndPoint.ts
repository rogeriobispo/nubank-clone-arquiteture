import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import { ExternalApi } from '../config';
import AppError from '../errors/AppErrors';

interface User {
  id: string;
  email: string;
  name: string;
}

const api = axios.create({
  baseURL: ExternalApi.authApiBaseUrl,
});
export default async function authorizedEndPoint(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers?.authorization;

    if (!token) throw new AppError('Unauthorized', 401);
    if (token) {
      const response = await api.get('/authorized', {
        headers: { authorization: token },
      });
      const user: User = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
      };

      req.currentUser = user;
    }
    next();
  } catch (error) {
    throw new AppError('Unauthorized', 401);
  }
}
