
import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_JWT_SECRET,
    });
  }

  async validate(data: any): Promise<any> {
    try {
      await this.authRepository.validate(data.sub);
      return { profile: data.profile, userId: data.sub, username: data.email };
    }catch(e) {
      throw new UnauthorizedException();
    }
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'RefreshJWT') {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.REFRESH_TOKEN_JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: any, data: any): Promise<any> {
    const token = request.get('Authorization')?.replace('Bearer ', '');
    const exists = await this.authRepository.signInRefresh(data, token);
    return { userId: exists.userId, username: exists.username, profile: data.profile, token };
  }
}
