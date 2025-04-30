import { UserEntity } from '@/domain/entities/user.entity';
import { ITransactionsExternal } from '@/domain/interfaces/external/transactions.external';
import { IGetTransactionsByWalletIdUseCase } from '@/domain/interfaces/use-cases/transactions/get.transactions.by.wallet.id.use-case';
import { TransactionsExternal } from '@/infrastructure/external/transactions.external';
import { CognitoModule } from '@/infrastructure/providers/aws/cognito/cognito.module';
import { HttpBdmModule } from '@/infrastructure/providers/http/bdm/http.bdm.module';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransanctionsController } from './api/controller/transactions.controller';
import { GetTransactionsByWalletIdUseCase } from './use-cases/get.transactions.by.wallet.id.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HttpBdmModule, CognitoModule],
  controllers: [TransanctionsController],
  providers: [
    Logger,
    {
      provide: ITransactionsExternal,
      useClass: TransactionsExternal,
    },
    {
      provide: IGetTransactionsByWalletIdUseCase,
      useClass: GetTransactionsByWalletIdUseCase,
    },
  ],
})
export class TransactionsModule {}
