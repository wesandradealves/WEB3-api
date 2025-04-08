import { UpdateFiles } from "@/domain/entities/update-files.entity";
import { ITransferUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.user-case";
import { Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransferUseCase } from "./use-cases/transfer.use-case";
import { ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { TransferRepository } from "@/infrastructure/repositories/transfer.repository";
import { TrasferController } from "./api/transfer.controller";
import { DashboardTransferList } from "@/domain/entities/dashboard-transfer-list.entity";
import { SqsProvider } from "@/infrastructure/providers/aws/sqs/sqs.provider";
import { BdmExternal } from "@/infrastructure/external/bdm.external";
import { CognitoModule } from "@/infrastructure/providers/aws/cognito/cognito.module";
import { HttpBdmModule } from "@/infrastructure/providers/http/bdm/http.bdm.module";
import { UserEntity } from "@/domain/entities/user.entity";
import { BlockchainExternal } from "@/infrastructure/external/blockchain.external";
import { IBdmExternal } from "@/domain/interfaces/external/bdm.external";
import { IBlockchainExternal } from "@/domain/interfaces/external/blockchain.external";

@Module({
  imports: [
     TypeOrmModule.forFeature([UpdateFiles, DashboardTransferList, UserEntity]),
     CognitoModule,
     HttpBdmModule,
  ],
  controllers: [TrasferController],
  providers: [
      Logger,
      SqsProvider,
        {
          provide: ITransferAssetRepository,
          useClass: TransferRepository,
        },
        {
          provide: ITransferUseCase,
          useClass: TransferUseCase,
        },
        {
          provide: IBdmExternal,
          useClass: BdmExternal,
        },
        {
          provide: IBlockchainExternal,
          useClass: BlockchainExternal,
        },
      ],
      
  exports: [],
})
export class TransferModule {}