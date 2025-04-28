import { UserEntity } from '@/domain/entities/user.entity';
import { IExtractExternal } from '@/domain/interfaces/external/extract.external';
import { IGetExtractByWalletIdUseCase } from '@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case';
import { ExtractExternal } from '@/infrastructure/external/extract.external';
import { CognitoModule } from '@/infrastructure/providers/aws/cognito/cognito.module';
import { HttpModule } from '@/infrastructure/providers/http/http.module';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExtractController } from './api/controller/extract.controller';
import { GetExtractByWalletIdUseCase } from './use-cases/get.extract.by.wallet.id.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), HttpModule, CognitoModule],
  controllers: [ExtractController],
  providers: [
    Logger,
    {
      provide: IExtractExternal,
      useClass: ExtractExternal,
    },
    {
      provide: IGetExtractByWalletIdUseCase,
      useClass: GetExtractByWalletIdUseCase,
    },
  ],
})
export class ExtractModule {}
