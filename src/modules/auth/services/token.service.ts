import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInResponseDto } from '../api/dtos/signIn.response.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService {
  private token: string;
  private refreshToken: string;
  private expiresJwt: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(TokenService.name);
    this.expiresJwt = this.configService.get('auth.tokenJwt.signOptions.expiresIn');
    this.expiresJwt = this.expiresJwt.replace('s', '');
  }
  async createTokenJwt(user: any): Promise<SignInResponseDto> {
    this.logger.log('Gerando token de autenticação.');

    this.token = this.jwtService.sign(
      { sub: user.id, profile: user.profile, email: user.email },
    );

    this.refreshToken = this.jwtService.sign(
      { sub: user.id, email: user.email, profile: user.profile },
      {
        expiresIn: process.env.REFRESH_TOKEN_JWT_EXPIRES,
        secret: process.env.REFRESH_TOKEN_JWT_SECRET,
      },
    );

    return {
      auth: true,
      expires: +this.expiresJwt,
      tokenJwt: this.token,
      refreshToken: this.refreshToken,
    };
  }
  async createTokenJwtReAuth(data: any, token: string): Promise<SignInResponseDto> {
    this.logger.log('Gerando token de autenticação com base no refresh token.');

    this.token = this.jwtService.sign(
      { sub: data.id, profile: data.profile, email: data.email },
      { expiresIn: process.env.TOKEN_JWT_EXPIRES },
    );

    return { auth: true, expires: 3600, tokenJwt: this.token, refreshToken: token };
  }
}
