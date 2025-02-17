import { AuthEntity } from '@/domain/entities/auth.entity';
import { UserEntity } from '@/domain/entities/user.entity';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { SignInRequestDto } from '@/modules/auth/api/dtos/signIn.request.dto';
import { SignInResponseDto } from '@/modules/auth/api/dtos/signIn.response.dto';
import { TokenService } from '@/modules/auth/services/token.service';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @Inject(ICognitoProvider)
    private readonly cognito: ICognitoProvider,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    private readonly logger: Logger,
    private readonly token: TokenService,
  ) {
    this.logger = new Logger(AuthRepository.name);
  }


  async signIn(data: SignInRequestDto): Promise<SignInResponseDto> {
    this.logger.log(data);
    let user = await this.userRepository.findOneBy({ email: data.username });
    if (!user) {
      this.logger.log('Parceiro não cadastrado.');
      throw new UnauthorizedException('Usuario não localizado.');
    }
    try{
      await this.cognito.signIn(data);
      const signin =  await this.token.createTokenJwt({
        id: user.id,
        email: user.email,
        profile: user.profile,
      });

      await this.storeAfterSignIn({
        username: user.email,
        userId: user.id,
        refreshToken: (await signin).refreshToken,
      });
      return signin;

    }catch(error){
      throw new UnauthorizedException();
    }
  }

  async signOut(data: any): Promise<any> {
    this.logger.log(data);

    throw new Error('Method not implemented.');
  }

  findUser(data: any): Promise<any> {
    throw new Error('Method not implemented.');
    return data
  }

  async storeAfterSignIn(data: any): Promise<any> {
    const existingRecord = await this.authRepository.findOne({ where: { userId: data.userId } });
    if (existingRecord) {
      await this.authRepository.update({ userId: data.userId }, data);
    } else {
      await this.authRepository.save(data);
    }
  }

  async signInRefresh(data: any, token: string): Promise<any> {
  // Utilizado para re-autenticar o usuário com o refresh token
      try {
        // Verifica se o refreshtoken existe na tabela de auths
        const result = await this.authRepository.findOne({
          where: { userId: data.sub, refreshToken: token },
        });

        if (!result) {
          throw new UnauthorizedException();
        }

        return result;
      } catch (e) {}
    }


    async validate(id: string): Promise<void> {
      const user = await this.userRepository.findOne({ where: { id } });
      if (!user) {
        throw new Error('Usuário não localizado.');
      }
    }
}