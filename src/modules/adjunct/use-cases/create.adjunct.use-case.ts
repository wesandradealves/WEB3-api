import { Inject, Injectable } from '@nestjs/common';
import { IBdmExternal } from '@/domain/interfaces/external/bdm.external';
import { IAdjunctRepository } from '@/domain/interfaces/repositories/adjunct.repository';
import { CreateAdjunctDto } from '../api/dtos/create.adjunct.dto';
import { ICreateAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/create.adjunct.use-case';

@Injectable()
export class CreateAdjunctUseCase implements ICreateAdjunctUseCase {
  logger: any;
  constructor(
    @Inject(IBdmExternal)
    private readonly bdm: IBdmExternal,

    @Inject(IAdjunctRepository)
    private readonly adjunctRepo: IAdjunctRepository,
  ) {}

  async execute(dto: CreateAdjunctDto) {
    const bdmData = await this.bdm.getBdmUserDataByEmail(dto.email);
    console.log(bdmData);
    try {
      return this.adjunctRepo.create({
        name: bdmData.name,
        surname: dto.surname,
        email: bdmData.email,
        phone: bdmData.phone,
        userBdmId: bdmData.id,
        representativeId: dto.representativeId,
        isActive: true,
      });
    } catch (error) {
      this.logger.error(`STATUS: ${error.status} | MESSAGE: ${error.message}`);
    }
  }
}
