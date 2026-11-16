import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[Error] [${req.method} ${req.url}]:`, {
    message,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(ENV.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
