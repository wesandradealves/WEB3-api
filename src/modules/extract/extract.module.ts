import { HttpModule } from "@/infrastructure/providers/http/http.module";
import { Logger, Module } from "@nestjs/common";
import { IGetExtractByWalletIdUseCase } from "@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case";
import { GetExtractByWalletIdUseCase } from "./use-cases/get.extract.by.wallet.id.use-case";
import { ExtractController } from "./api/controller/extract.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@/domain/entities/user.entity";
import { IExtractRepository } from "@/domain/interfaces/repositories/extract.repository";
import { ExtractRepository } from "@/infrastructure/repositories/extract.repository";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule,
  ],
  controllers: [ExtractController],
  providers: [
    Logger,
    {
      provide: IExtractRepository,
      useClass: ExtractRepository,
    },
    {
      provide: IGetExtractByWalletIdUseCase,
      useClass: GetExtractByWalletIdUseCase,
    },
  ],
})
export class ExtractModule { }