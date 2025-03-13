import { IGetTransactionsByWalletIdUseCase } from '@/domain/interfaces/use-cases/transactions/get.transactions.by.wallet.id.use-case';
import { Logger, Module } from '@nestjs/common';
import { GetTransactionsByWalletIdUseCase } from './use-cases/get.transactions.by.wallet.id.use-case';
import { TransactionsRepository } from '@/infrastructure/repositories/transactions.repository';
import { ItransactionsRepository } from '@/domain/interfaces/repositories/transactions.repository';
import { TransanctionsController } from './api/controller/transactions.controller';
import { HttpModule } from '@/infrastructure/providers/http/http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule,
  ],
  controllers: [TransanctionsController],
  providers: [
    Logger,
    {
      provide: ItransactionsRepository,
      useClass: TransactionsRepository,
    },
    {
      provide: IGetTransactionsByWalletIdUseCase,
      useClass: GetTransactionsByWalletIdUseCase,
    },
  ],
})
export class TransactionsModule { }