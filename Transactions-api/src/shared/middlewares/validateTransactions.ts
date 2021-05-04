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
  baseURL: ExternalApi.transactionBaseUrl,
});
export default async function authorizedEndPoint(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers?.authorization;
    const userID = req.currentUser.id;
    const { transactionID, amount } = req.body;

    if (token) {
      await api.post(`/transactions/${transactionID}/validate`, {
        headers: { authorization: token },
        body: {
          userID,
          amount,
        },
      });
    }
    next();
  } catch (error) {
    throw new AppError('Transaction not found', 422);
  }
}
