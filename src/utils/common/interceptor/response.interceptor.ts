import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                // You can access the request/response context if needed
                const ctx = context.switchToHttp();
                const response = ctx.getResponse();

                return {
                    success: true,
                    status: response.statusCode, // Extract status from response
                    data: data, // The actual response data
                    message: 'Request successful', // You can customize the message if needed
                };
            }),
        );
    }
}
