import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "1586529335880352852239899278044849475655258046780306845976733908478349756801582052982583820415405684",
    });
  }

  async validate(payload: any) {
    return { email: payload.email, _id: payload._id, role: payload.role };
  }
}
