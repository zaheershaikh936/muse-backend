import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerMiddleware } from './utils/common/http.logger/http.logger';
import { GlobalExceptionFilter } from './utils/common/interceptor';
import { ConfigModule } from '@nestjs/config';
import {
  AppController,
  AppService,
  AuthModule,
  ProfessionModule,
  RoleModule,
  MentorModule,
  AppConfigModule,
  AvailabilityModule,
  BookingsModule,
  FileUploadModule,
  InvoiceModule,
  PaymentModule
} from './app';
import { MongooseModule } from '@nestjs/mongoose';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB),
    AuthModule,
    ProfessionModule,
    RoleModule,
    MentorModule,
    AppConfigModule,
    AvailabilityModule,
    BookingsModule,
    FileUploadModule,
    InvoiceModule,
    PaymentModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: GlobalExceptionFilter, useClass: SentryGlobalFilter },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
