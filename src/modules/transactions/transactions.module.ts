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
import { IGetConsolidateTransactionsByWalletIdUseCase } from '@/domain/interfaces/use-cases/transactions/get.consolidate.transactions.by.wallet.id.use-case';
import { GetConsolidateTransactionsByWalletIdUseCase } from './use-cases/get.consolidate.transactions.by.wallet.id.use-case';
import { IFileExportService } from '@/domain/interfaces/services/file.export.service';
import { FileExportService } from '@/infrastructure/repositories/services/FileExportService';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HttpBdmModule, CognitoModule],
  controllers: [TransanctionsController],
  providers: [
    Logger,
    FileExportService,
    {
      provide: ITransactionsExternal,
      useClass: TransactionsExternal,
    },
    {
      provide: IFileExportService,
      useClass: FileExportService,
    },
    {
      provide: IGetTransactionsByWalletIdUseCase,
      useClass: GetTransactionsByWalletIdUseCase,
    },
    {
      provide: IGetConsolidateTransactionsByWalletIdUseCase,
      useClass: GetConsolidateTransactionsByWalletIdUseCase,
    },
  ],
})
export class TransactionsModule {}
