import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { ICreateTokenUseCase } from '@/domain/interfaces/use-cases/tokens/create.token.use-case';
import { IGetTokenByIdUseCase } from '@/domain/interfaces/use-cases/tokens/getById.token.use-case';
import { IUpdateTokenUseCase } from '@/domain/interfaces/use-cases/tokens/update.token.use-case';
import { IDeleteTokenUseCase } from '@/domain/interfaces/use-cases/tokens/delete.token.use-case';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrefixTokenEntity } from 'src/domain/entities/prefix.token.entity';
import { TokenRepository } from '../../infrastructure/repositories/token.repository';
import { TokensController } from './api/controller/tokens.controller';
import { CreateTokenUseCase } from './use-cases/create-token.use-case';
import { DeleteTokenUseCase } from './use-cases/delete-token.use-case';
import { GetTokenByIdUseCase } from './use-cases/get-token-by-id.use-case';

import { IGetAllTokenUseCase } from '@/domain/interfaces/use-cases/tokens/getAll.token.use-case';
import { GetAllTokenUseCase } from './use-cases/get-all-tokens.use-case';
import { UpdateTokenUseCase } from './use-cases/update-token.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PrefixTokenEntity])],
  controllers: [TokensController],
  providers: [
    {
      provide: ITokenRepository,
      useClass: TokenRepository,
    },
    {
      provide: ICreateTokenUseCase,
      useClass: CreateTokenUseCase,
    },
    {
      provide: IUpdateTokenUseCase,
      useClass: UpdateTokenUseCase,
    },
    {
      provide: IDeleteTokenUseCase,
      useClass: DeleteTokenUseCase,
    },
    {
      provide: IGetAllTokenUseCase,
      useClass: GetAllTokenUseCase,
    },
    {
      provide: IGetTokenByIdUseCase,
      useClass: GetTokenByIdUseCase,
    },
  ],
})
export class TokenModule {}
