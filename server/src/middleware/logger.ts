import { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';

export interface CorrelatedRequest extends Request {
  correlationId?: string;
  startTime?: number;
}

export function requestLogger(req: CorrelatedRequest, res: Response, next: NextFunction): void {
  const correlationId = (req.headers['x-request-id'] as string) || crypto.randomUUID();
  req.correlationId = correlationId;
  req.startTime = Date.now();
  res.setHeader('X-Request-Id', correlationId);

  res.on('finish', () => {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    const logData = {
      level: res.statusCode >= 500 ? 'ERROR' : res.statusCode >= 400 ? 'WARN' : 'INFO',
      timestamp: new Date().toISOString(),
      correlationId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      userAgent: req.get('user-agent') || 'unknown',
      ip: req.ip || req.socket.remoteAddress
    };

    if (process.env.NODE_ENV !== 'test') {
      console.log(JSON.stringify(logData));
    }
  });

  next();
}
