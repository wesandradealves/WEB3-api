import { DashboardTransferList } from "@/domain/entities/dashboard-transfer-list.entity";
import { UpdateFiles } from "@/domain/entities/update-files.entity";
import { DataBaseModule } from "@/infrastructure/database/database.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HttpBdmModule } from "@/infrastructure/providers/http/bdm/http.bdm.module";
import { SqsProvider } from "@/infrastructure/providers/aws/sqs/sqs.provider";
import { TransferRepository } from "@/infrastructure/repositories/transfer.repository";
import { ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { TransferAssetUseCase } from "./use-cases/transfer.asset.use-case";
import { BdmExternal } from "@/infrastructure/external/bdm.external";
import { CognitoModule } from "@/infrastructure/providers/aws/cognito/cognito.module";
import { ICognitoProvider } from "@/domain/interfaces/providers/cognito/cognito.provider";
import { CognitoProvider } from "@/infrastructure/providers/aws/cognito/cognito.provider";
import { Logger } from "@nestjs/common";
import { BlockchainExternal } from "@/infrastructure/external/blockchain.external";
import { UserEntity } from "@/domain/entities/user.entity";
import { IBlockchainExternal } from "@/domain/interfaces/external/blockchain.external";
import { IBdmExternal } from "@/domain/interfaces/external/bdm.external";
import { ITransferAssetUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.asset.user-case";
import { HttpBlochChainModule } from "@/infrastructure/providers/http/blockchain/http.blockchain.module";
import { ConfigModule } from "@nestjs/config";
import AppEnvs from "@/infrastructure/config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, load: [AppEnvs]}),
    DataBaseModule,
    TypeOrmModule.forFeature([UpdateFiles, DashboardTransferList, UserEntity]),
    HttpBdmModule,
    CognitoModule,
    HttpBlochChainModule,
  ],
  controllers: [],
  providers: [
    SqsProvider,
    Logger,
    {
      provide: ICognitoProvider,
      useClass: CognitoProvider,
    },
    {
      provide: ITransferAssetRepository,
      useClass: TransferRepository,
    },
    {
      provide: ITransferAssetUseCase,
      useClass: TransferAssetUseCase,
    },
    {
      provide: IBlockchainExternal,
      useClass: BlockchainExternal,
    },
    {
      provide: IBdmExternal,
      useClass: BdmExternal,
    },
  ],
})
export class DashboardTransferAssetsModule { }