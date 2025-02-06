import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(IAuthRepository)
    private readonly authRepository: IAuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_JWT_SECRET,
    });
  }

  async validate(data: any): Promise<void> {
    const user = await this.authRepository.findUser(data.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
  }
}
