import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RmqLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RmqLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const { url } = req;
    const timestamp = new Date().toISOString();

    this.logger.log(`[${timestamp}] RMQ Event/Message Received: ${url}`);

    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { statusCode } = res;

      if (statusCode >= 200 && statusCode < 400) {
        this.logger.log(
          `[${timestamp}] RMQ Event/Message Handled: ${url} - Duration: ${duration}ms`,
        );
      } else {
        this.logger.error(
          `[${timestamp}] RMQ Event/Message Failed: ${url} - Duration: ${duration}ms - Status: ${statusCode}`,
        );
      }
    });

    next();
  }
}
