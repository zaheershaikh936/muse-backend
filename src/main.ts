import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import 'src/utils/logs'
import * as cookieParser from 'cookie-parser';
import { GlobalExceptionFilter, ResponseInterceptor } from './utils/common/interceptor';
async function bootstrap() {
  const port = process.env.PORT || 8080
  const app = await NestFactory.create(AppModule, { cors: true, bufferLogs: true, logger: ['log', 'error', 'warn', 'debug', 'verbose'] });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api/v1/');
  //! /* SECURITY */
  app.enableCors();
  app.use(helmet());

  //? Rate Limit Middleware
  app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:
      "Too many requests from this IP, please try again later"
  }));
  const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 3, // start blocking after 3 requests
    message:
      "Too many accounts created from this IP, please try again after an hour"
  });
  app.use("/auth/email/register", createAccountLimiter);
  await app.listen(port);
  Logger.verbose('Server started on port http://localhost:8080');
}

bootstrap();
