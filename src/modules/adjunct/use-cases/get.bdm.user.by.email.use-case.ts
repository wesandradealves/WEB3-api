import { Inject, Injectable } from '@nestjs/common';
import { IBdmExternal } from '@/domain/interfaces/external/bdm.external';
import { IGetBdmUserByEmailUseCase } from '@/domain/interfaces/use-cases/adjunct/get.bdm.user.by.email.use-case';

@Injectable()
export class GetBdmUserByEmailUseCase implements IGetBdmUserByEmailUseCase {
  constructor(
    @Inject(IBdmExternal)
    private readonly bdm: IBdmExternal,
  ) {}

  async execute(email: string) {
    return this.bdm.getBdmUserDataByEmail(email);
  }
}
