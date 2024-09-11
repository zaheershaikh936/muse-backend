import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { WithSentry } from '@sentry/nestjs';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    @WithSentry()
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        response.status(status).json({
            status: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception instanceof HttpException ? exception.message : 'Internal server error',
        });
    }
}
