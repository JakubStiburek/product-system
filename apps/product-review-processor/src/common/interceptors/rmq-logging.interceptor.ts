import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RmqContext } from '@nestjs/microservices';

@Injectable()
export class RmqLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RmqLoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rmqContext = context.switchToRpc();
    const rmqCtx = rmqContext.getContext<RmqContext>();

    const pattern = rmqCtx.getPattern();
    const timestamp = new Date().toISOString();

    this.logger.log(`[${timestamp}] RMQ Event/Message Received: ${pattern}`);

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.log(
          `[${timestamp}] RMQ Event/Message Handled: ${pattern} - Duration: ${duration}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `[${timestamp}] RMQ Event/Message Failed: ${pattern} - Duration: ${duration}ms - Error: ${error.message}`,
        );
        throw error;
      }),
    );
  }
}
