import { Inject, Logger, Module, forwardRef } from '@nestjs/common';
import { LoginService } from './login/login.service';
import { LogoutService } from './logout/logout.service';
import { RegisterService } from './register/register.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas';
import { UsersModule } from '../index'
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    }),
    forwardRef(() => UsersModule)
  ],
  providers: [LoginService, LogoutService, RegisterService],
  controllers: [AuthController]
})
export class AuthModule { }
