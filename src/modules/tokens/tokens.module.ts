import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenUseCases } from './use-cases/token.use-cases';
import { PrefixTokenEntity } from '../../domain/entities/prefix.token.entity';
import { TokensController } from './api/controller/tokens.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrefixTokenEntity])],
  controllers: [TokensController],
  providers: [TokenUseCases],
  exports: [TokenUseCases],
})
export class TokensModule {}