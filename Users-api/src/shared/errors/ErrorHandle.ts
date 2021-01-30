import { Request, Response, NextFunction } from 'express';

import AppError from './AppErrors';

const ErrorHandler = function (
  err: Error,
  _: Request,
  response: Response,
  __: NextFunction
) {
  if (err instanceof AppError)
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });

  if (err instanceof SyntaxError && 'body' in err) {
    return response.status(422).json({
      status: 'error',
      message: 'Body parse failed',
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};

export default ErrorHandler;
