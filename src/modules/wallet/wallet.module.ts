import { UserEntity } from "@/domain/entities/user.entity";
import { HttpModule } from "@/infrastructure/providers/http/http.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WalletController } from "./api/controller/wallet.controller";
import { IWalletRepository } from "@/domain/interfaces/external/wallet.external";
import { WalletRepository } from "@/infrastructure/external/wallet.external";
import { IGetUserWalletsUseCase } from "@/domain/interfaces/use-cases/wallets/get.user.wallets.use-case";
import { GetUserWalletsUseCase } from "./use-cases/get.user.wallets.use-case";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpModule,
  ],
  controllers: [
    WalletController,
  ],
  providers: [
    {
      provide: IWalletRepository,
      useClass: WalletRepository,
    },
    {
      provide: IGetUserWalletsUseCase,
      useClass: GetUserWalletsUseCase,
    }
  ],
})
export class WalletModule {}