import { Module, forwardRef } from '@nestjs/common';
import { LoginService } from './login/login.service';
import { SocialAuthService } from './social-auth/social-auth.services';
import { LogoutService } from './logout/logout.service';
import { RegisterService } from './register/register.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas';
import { UsersModule } from '../index';
import { JwtStrategy } from 'src/utils/common/auth/strategy/jwt.strategy';
import { FirebaseModule } from '../firebase/firebase.module';
import { MagicLinkModule } from '../magic-link/magic-link.module';
import { ForgetPasswordService } from './forget-password/forget-password.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    forwardRef(() => FirebaseModule),
    forwardRef(() => UsersModule),
    forwardRef(() => MagicLinkModule),
  ],
  providers: [
    LoginService,
    LogoutService,
    RegisterService,
    JwtStrategy,
    SocialAuthService,
    ForgetPasswordService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
