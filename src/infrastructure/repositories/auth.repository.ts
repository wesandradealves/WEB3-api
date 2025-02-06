import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { SignInRequestDto } from '@/modules/auth/api/dtos/signIn.request.dto';
import { SignInResponseDto } from '@/modules/auth/api/dtos/signIn.response.dto';
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    private readonly jwtService: JwtService,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(AuthRepository.name);
  }

  async signIn(data: SignInRequestDto): Promise<SignInResponseDto> {
    this.logger.log(data); // Para não dar erro de compilação
    const result = {
      name: 'Winston',
      email: 'winston.m.jesus@gmail.com',
      sub: 'bfa6bbbf-b30d-435d-a796-e1b3614bd1ae',
    };
    const token = this.jwtService.sign(result);
    return { auth: true, expires: 3600, tokenJwt: token, refreshToken: '' };
  }
  async signOut(data: any): Promise<any> {
    this.logger.log(data); // Para não dar erro de compilação

    throw new Error('Method not implemented.');
  }
  async findUser(data: any): Promise<any> {
    this.logger.log(data); // Para não dar erro de compilação

    return { name: 'Winston', email: 'winston.m.jesus@gmail.com' };
  }
}
