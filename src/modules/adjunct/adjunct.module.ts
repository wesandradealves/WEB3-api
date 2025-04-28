import { AdjunctEntity } from '@/domain/entities/adjunct.entity';
import { IBdmExternal } from '@/domain/interfaces/external/bdm.external';
import { IAdjunctRepository } from '@/domain/interfaces/repositories/adjunct.repository';
import { BdmExternal } from '@/infrastructure/external/bdm.external';
import { HttpModule } from '@/infrastructure/providers/http/http.module';
import { AdjunctRepository } from '@/infrastructure/repositories/adjunct.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdjunctController } from './api/controller/adjunct.controller';
import { CreateAdjunctUseCase } from './use-cases/create.adjunct.use-case';
import { FindOneAdjunctUseCase } from './use-cases/find.one.adjunct.use-case';
import { ListAllAdjunctsUseCase } from './use-cases/list.all.adjunct.use-case';
import { UpdateAdjunctUseCase } from './use-cases/update.adjunct.use-case';
import { Module } from '@nestjs/common';
import { GetBdmUserByEmailUseCase } from './use-cases/get.bdm.user.by.email.use-case';
import { ICreateAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/create.adjunct.use-case';
import { IFindOneAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/find.one.adjunct.use-case';
import { IGetBdmUserByEmailUseCase } from '@/domain/interfaces/use-cases/adjunct/get.bdm.user.by.email.use-case';
import { IListAllAdjunctsUseCase } from '@/domain/interfaces/use-cases/adjunct/list.all.adjunct.use-case';
import { IUpdateAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/update.adjunct.use-case';
import { CognitoModule } from '@/infrastructure/providers/aws/cognito/cognito.module';

@Module({
  imports: [TypeOrmModule.forFeature([AdjunctEntity]), HttpModule, CognitoModule],
  controllers: [AdjunctController],
  providers: [
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
