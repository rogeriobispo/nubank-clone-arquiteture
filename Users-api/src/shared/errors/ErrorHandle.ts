import { Request, Response, NextFunction } from 'express';

import AppError from './AppErrors';

const ErrorHandler = function(err: Error, _: Request, response: Response, __: NextFunction) {
  if(err instanceof AppError) 
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    })
}


export default ErrorHandler;
