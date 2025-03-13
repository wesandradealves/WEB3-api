import { AuthEntity } from '@/domain/entities/auth.entity';
import { AuthMfaEntity } from '@/domain/entities/auth.mfa.entity';
import { UserEntity } from '@/domain/entities/user.entity';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import { ISESProvider } from '@/domain/interfaces/providers/ses.provider';
import {
  IAuthRepository,
  ISignInOperatorRequest,
} from '@/domain/interfaces/repositories/auth.repository';
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
    private readonly user: Repository<UserEntity>,
    @InjectRepository(AuthEntity)
    private readonly auth: Repository<AuthEntity>,
    @InjectRepository(AuthMfaEntity)
    private readonly authMFA: Repository<AuthMfaEntity>,
    @Inject(ISESProvider)
    private readonly sesProvider: ISESProvider,
    private readonly logger: Logger,
    private readonly token: TokenService,
  ) {
    this.logger = new Logger(AuthRepository.name);
  }

  async signIn(data: SignInRequestDto): Promise<SignInResponseDto> {
    try {
      // Verifica se o usuário existe no banco do dashboard
      let user = await this.user.findOneBy({ email: data.username });
      if (!user) {
        this.logger.log('Usuário não cadastrado.');
        throw new UnauthorizedException();
      }

      // Autenticando no cognito
      this.logger.log('Usuário não cadastrado no cognito.');
      await this.cognito.signIn(data);

      // Gerando token e refresh token
      this.logger.log('Erro ao criar o token.');
      const signin = await this.token.createTokenJwt({
        id: user.id,
        email: user.email,
        profile: user.profile,
      });

      // Gravando dados de autenticação no banco
      this.logger.log('Erro ao gravar os daos de login no banco.');
      await this.storeAfterSignIn({
        userId: user.id,
        refreshToken: signin.refreshToken,
      });

      // Retorna os tokens
      return signin;
    } catch (e) {
      this.logger.log(e);
      throw new UnauthorizedException();
    }
  }

  async storeAfterSignIn(data: any): Promise<any> {
    const existingRecord = await this.auth.findOne({ where: { userId: data.userId } });
    if (existingRecord) {
      await this.auth.update({ userId: data.userId }, data);
    } else {
      await this.auth.save(data);
    }
  }

  async signInRefresh(data: any, token: string): Promise<any> {
    try {
      const result = await this.auth.findOne({
        where: { userId: data.sub, refreshToken: token },
      });

      if (!result) {
        throw new UnauthorizedException();
      }

      return result;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        this.logger.log('Token ');
        throw e;
      }

      this.logger.log('Erro ao validar o refresh token.', e);
      throw e;
    }
  }

  async validate(id: string): Promise<void> {
    const user = await this.user.findOne({ where: { id } });
    if (!user) {
      throw new Error('Usuário não localizado.');
    }
  }

  async signInSendTwoFa(data: ISignInOperatorRequest): Promise<any> {
    const user = await this.user.findOneBy({ email: data.username });
    if (!user) {
      throw new UnauthorizedException('Usuario não localizado.');
    }
    try {
      await this.cognito.signIn(data);

      const twofaCode = this.create2faCode();
      const existingRecord = await this.authMFA.findOne({ where: { userId: user.id } });
      if (existingRecord) {
        await this.authMFA.update(
          { userId: user.id },
          { mfa: twofaCode.toString(), isValid: true },
        );
      } else {
        await this.authMFA.save({
          userId: user.id,
          mfa: twofaCode.toString(),
          isValid: true,
        });
      }

      await this.sesProvider.dispatchEmail({
        receiver: user.email,
        template: process.env.SES_2FA_TEMPLATE,
        templateData: { name: 'customer', random_2fa: twofaCode },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async validateTwoFa(username: string, twoFa: number): Promise<any> {
    const user = await this.user.findOneBy({ email: username });
    if (!user) {
      throw new Error();
    }

    const existingRecord = await this.authMFA.findOne({
      where: { userId: user.id, mfa: twoFa.toString() },
    });
    if (!existingRecord) {
      throw new Error();
    }
    if (existingRecord.mfa !== twoFa.toString()) {
      throw new UnauthorizedException('Código inválido.');
    }

    await this.authMFA.update({ userId: user.id }, { isValid: false });
    return true;
  }

  private create2faCode() {
    return Math.floor(10000 + Math.random() * 90000);
  }
}
