import { AdjunctEntity } from '@/domain/entities/adjunct.entity';
import { IBdmExternal } from '@/domain/interfaces/external/bdm.external';
import { IAdjunctRepository } from '@/domain/interfaces/repositories/adjunct.repository';
import { ICreateAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/create.adjunct.use-case';
import { IFindOneAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/find.one.adjunct.use-case';
import { IGetBdmUserByEmailUseCase } from '@/domain/interfaces/use-cases/adjunct/get.bdm.user.by.email.use-case';
import { IListAllAdjunctsUseCase } from '@/domain/interfaces/use-cases/adjunct/list.all.adjunct.use-case';
import { IUpdateAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/update.adjunct.use-case';
import { BdmExternal } from '@/infrastructure/external/bdm.external';
import { CognitoModule } from '@/infrastructure/providers/aws/cognito/cognito.module';
import { HttpBdmModule } from '@/infrastructure/providers/http/bdm/http.bdm.module';
import { AdjunctRepository } from '@/infrastructure/repositories/adjunct.repository';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdjunctController } from './api/controller/adjunct.controller';
import { CreateAdjunctUseCase } from './use-cases/create.adjunct.use-case';
import { FindOneAdjunctUseCase } from './use-cases/find.one.adjunct.use-case';
import { GetBdmUserByEmailUseCase } from './use-cases/get.bdm.user.by.email.use-case';
import { ListAllAdjunctsUseCase } from './use-cases/list.all.adjunct.use-case';
import { UpdateAdjunctUseCase } from './use-cases/update.adjunct.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([AdjunctEntity]), HttpBdmModule, CognitoModule],
  controllers: [AdjunctController],
  providers: [
    Logger,
    {
      provide: IBdmExternal,
      useClass: BdmExternal,
    },
    {
      provide: IAdjunctRepository,
      useClass: AdjunctRepository,
    },
    {
      provide: ICreateAdjunctUseCase,
      useClass: CreateAdjunctUseCase,
    },
    {
      provide: IListAllAdjunctsUseCase,
      useClass: ListAllAdjunctsUseCase,
    },
    {
      provide: IFindOneAdjunctUseCase,
      useClass: FindOneAdjunctUseCase,
    },
    {
      provide: IUpdateAdjunctUseCase,
      useClass: UpdateAdjunctUseCase,
    },
    {
      provide: IGetBdmUserByEmailUseCase,
      useClass: GetBdmUserByEmailUseCase,
    },
  ],
})
export class AdjunctModule {}
