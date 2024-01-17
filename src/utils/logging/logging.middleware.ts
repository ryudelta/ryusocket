import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log(
      `[${new Date().toISOString()}] Request ${req.method} ${req.url}`,
    );
    next();
  }
}
