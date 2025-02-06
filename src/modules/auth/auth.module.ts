import { Logger, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthEntity } from '@/domain/entities/auth.entity';
import { IAuthRepository } from '@/domain/interfaces/repositories/auth.repository';
import { ISignInUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.use-case';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from 'src/infrastructure/repositories/auth.repository';
import { AuthController } from './api/controller/auth.controller';
import { JwtStrategy } from './jwt.auth.strategy';
import { SignInUseCase } from './use-cases/signin.user.use-case';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        ...config.get('config.auth.tokenJwt'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    Logger,
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
    {
      provide: ISignInUseCase,
      useClass: SignInUseCase,
    },
  ],
  exports: [JwtModule, IAuthRepository],
})
export class AuthModule {}
