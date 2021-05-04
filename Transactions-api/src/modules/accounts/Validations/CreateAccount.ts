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
    kind: Yup.string()
      .matches(
        /(salary|savings|current)/,
        'kind must match the following: salary savings current'
      )
      .required(),
    personKind: Yup.string()
      .matches(
        /(phisical|juridical)/,
        'personKind must match the following: phisical juridical'
      )
      .required(),
    userId: Yup.string()
      .matches(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        'must be a valid uuid '
      )
      .required(),
    balance: Yup.number().required(),
    overdraft: Yup.number().required(),
    address: Yup.object({
      cep: Yup.string().required(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      street: Yup.string().required(),
      neighborhood: Yup.string().required(),
      number: Yup.string().required(),
    }).required(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
  } catch (err) {
    throw new AppError(YupResponseFormatter(err), 422);
  }

  next();
};
