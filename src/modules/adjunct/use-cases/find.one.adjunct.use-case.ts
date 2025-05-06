import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAdjunctRepository } from '@/domain/interfaces/repositories/adjunct.repository';
import { IFindOneAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/find.one.adjunct.use-case';
import { AdjunctEntity } from '@/domain/entities/adjunct.entity';

@Injectable()
export class FindOneAdjunctUseCase implements IFindOneAdjunctUseCase {
  constructor(
    @Inject(IAdjunctRepository)
    private readonly adjunctRepo: IAdjunctRepository,
  ) {}

  async execute(id: string): Promise<AdjunctEntity> {
    const adjunct = await this.adjunctRepo.findById(id);
    if (!adjunct) {
      throw new NotFoundException(`Adjunto com id ${id} não encontrado.`);
    }
    return adjunct;
  }
}
