import { Controller, Get, Logger, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from 'src/utils/common/interceptor/logging.interceptor';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  healthCheckUp(): string {
    return this.appService.healthCheckUp();
  }

  @Get("/debug-sentry")
  getError() {
    throw new Error("My first Sentry error!");
  }
}
