import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthEntity } from '@/domain/entities/auth.entity';
import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { ISignInUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.use-case';
import { AuthRepository } from 'src/infrastructure/repositories/auth.repository';
import { AuthController } from './api/controller/auth.controller';
import { JwtStrategy, RefreshJwtStrategy } from './jwt.auth.strategy';
import { SignInUseCase } from './use-cases/signin.user.use-case';
import { CognitoModule } from '@/infrastructure/providers/aws/cognito/cognito.module';
import { TokenService } from './services/token.service';
import { UserModule } from '../user/user.module';
import { UserEntity } from '@/domain/entities/user.entity';
import { ISignInRefreshTokenUseCase } from '@/domain/interfaces/use-cases/auth/signin.refresh.token.use-case';
import { SignInRefreshTokenUseCase } from './use-cases/signIn.refresh.token.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity, UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.TOKEN_JWT_SECRET,
      signOptions: {
        expiresIn: process.env.TOKEN_JWT_EXPIRES,
      },
    }),
    CognitoModule,
    UserModule
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
  ],
  exports: [JwtModule, IAuthRepository],
})
export class AuthModule {}
