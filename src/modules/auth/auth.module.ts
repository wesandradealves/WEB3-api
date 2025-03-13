import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthEntity } from '@/domain/entities/auth.entity';
import { AuthMfaEntity } from '@/domain/entities/auth.mfa.entity';
import { UserEntity } from '@/domain/entities/user.entity';
import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { ISignInRefreshTokenUseCase } from '@/domain/interfaces/use-cases/auth/signin.refresh.token.use-case';
import { ISignInUserSendTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.send.two.fa.use-case';
import { ISignInUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.use-case';
import { IValidateTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/validate.two.fa.use-case';
import { CognitoModule } from '@/infrastructure/providers/aws/cognito/cognito.module';
import { SESModule } from '@/infrastructure/providers/aws/ses/ses.module';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from 'src/infrastructure/repositories/auth.repository';
import { UserModule } from '../user/user.module';
import { AuthController } from './api/controller/auth.controller';
import { JwtStrategy, RefreshJwtStrategy } from './jwt.auth.strategy';
import { TokenService } from './services/token.service';
import { SignInRefreshTokenUseCase } from './use-cases/signIn.refresh.token.use-case';
import { SignInSendTwoFaUseCase } from './use-cases/signin.user.send.two.fa.use-case';
import { SignInUseCase } from './use-cases/signin.user.use-case';
import { ValidaTwoFaUseCase } from './use-cases/validate.two.fa.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity, UserEntity, AuthMfaEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        ...config.get('auth.tokenJwt'),
      }),
      inject: [ConfigService],
    }),
    CognitoModule,
    UserModule,
    SESModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    Logger,
    TokenService,
    RefreshJwtStrategy,
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    {
      provide: ISignInUseCase,
      useClass: SignInUseCase,
    },
    {
      provide: ISignInRefreshTokenUseCase,
      useClass: SignInRefreshTokenUseCase,
    },
    {
      provide: ISignInUserSendTwoFaUseCase,
      useClass: SignInSendTwoFaUseCase,
    },
    {
      provide: IValidateTwoFaUseCase,
      useClass: ValidaTwoFaUseCase,
    },
  ],
  exports: [JwtModule, IAuthRepository],
})
export class AuthModule {}
