import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      if (statusCode >= 200 && statusCode <= 299) {
        this.logger.log(
          `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
        );
      } else if (statusCode === 304) {
        this.logger.warn(
          `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
        );
      } else {
        this.logger.error(
          `${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`,
        );
      }
    });

    next();
  }
}
