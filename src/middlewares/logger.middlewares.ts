import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: any, res: Response, next: Function) {
        try {
            var offUsCateRequest = JSON.parse(JSON.stringify(req.body));
            if (offUsCateRequest && offUsCateRequest.password) offUsCateRequest.password = "*******";
            if (offUsCateRequest && offUsCateRequest.newPassword) offUsCateRequest.newPassword = "*******";
            if (offUsCateRequest && offUsCateRequest.currentPassword) offUsCateRequest.currentPassword = "*******";
            if (offUsCateRequest !== null && offUsCateRequest !== undefined) console.log(new Date().toString() + ' - [Request] ' + req.baseUrl + " - " + JSON.stringify(offUsCateRequest));
        } catch (error) { }
        next();
    };
}