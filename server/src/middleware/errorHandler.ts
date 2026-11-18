import { Request, Response, NextFunction } from 'express';
import { CorrelatedRequest } from './logger.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandler(
  err: AppError,
  req: CorrelatedRequest,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const correlationId = req.correlationId || 'unknown';

  const errorResponse = {
    error: {
      code: err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST'),
      message: err.message || 'Ha ocurrido un error inesperado',
      correlationId,
      timestamp: new Date().toISOString(),
      ...(err.details ? { details: err.details } : {})
    }
  };

  if (statusCode >= 500) {
    console.error(`[ERROR] [${correlationId}]`, err.stack || err);
  }

  res.status(statusCode).json(errorResponse);
}
