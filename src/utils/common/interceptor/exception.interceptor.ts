import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { WithSentry } from '@sentry/nestjs';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    @WithSentry()
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        exception instanceof HttpException
        let message;
        if (exception?.response) {
            message = exception?.response
        } else {
            message = 'Something went wrong'
        }
        response.status(status).json({
            success: false,
            status: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message,
        });
    }
}
