import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Use the same default as CommonModule/AuthModule to keep signing/verifying consistent in dev
      secretOrKey: configService.get('JWT_SECRET', 'your-super-secret-jwt-key'),
    });
  }

  async validate(payload: any) {
    try {
      const user = await this.authService.getUserById(payload.sub);
      if (!user || (user as any).is_active === false) {
        throw new UnauthorizedException('유효하지 않은 사용자입니다.');
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
