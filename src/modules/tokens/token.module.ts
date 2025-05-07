import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrefixTokenEntity } from 'src/domain/entities/prefix.token.entity';
import { TokensController } from './api/controller/tokens.controller';
import { CreateTokenUseCase } from './use-cases/create-token.use-case';
import { GetAllTokensUseCase } from './use-cases/get-all-tokens.use-case';
import { GetTokenByIdUseCase } from './use-cases/get-token-by-id.use-case';
import { UpdateTokenUseCase } from './use-cases/update-token.use-case';
import { DeleteTokenUseCase } from './use-cases/delete-token.use-case';
import { TOKEN_REPOSITORY } from './token.symbols';
import { TokenRepository } from './repository/token.repository';
import { TokenUseCases } from './use-cases/token.use-cases';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PrefixTokenEntity]), AuthModule],
  controllers: [TokensController],
  providers: [
    TokenUseCases, 
    CreateTokenUseCase,
    GetAllTokensUseCase,
    GetTokenByIdUseCase,
    UpdateTokenUseCase,
    DeleteTokenUseCase,
    {
      provide: TOKEN_REPOSITORY,
      useClass: TokenRepository,
    },
  ],
  exports: [TokenUseCases], 
})
export class TokenModule {}
