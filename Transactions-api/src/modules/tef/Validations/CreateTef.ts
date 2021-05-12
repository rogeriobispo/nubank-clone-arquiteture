import { Request, Response, NextFunction } from 'express';
import * as Yup from 'yup';
import AppError from '../../../shared/errors/AppErrors';
import YupResponseFormatter from '../libs/YupResponseFormatter';

export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  const schema = Yup.object().shape({
    originAccount: Yup.string().required(),
    destinyAccount: Yup.string().required(),
    amount: Yup.number().required(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (err) {
    throw new AppError(YupResponseFormatter(err), 422);
  }

  next();
};
