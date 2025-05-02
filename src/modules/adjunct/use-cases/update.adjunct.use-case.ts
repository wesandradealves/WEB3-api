import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IAdjunctRepository } from '@/domain/interfaces/repositories/adjunct.repository';
import { IUpdateAdjunctUseCase } from '@/domain/interfaces/use-cases/adjunct/update.adjunct.use-case';
import { AdjunctEntity } from '@/domain/entities/adjunct.entity';
import { UpdateAdjunctDto } from '../api/dtos/update.adjunct.dto';

@Injectable()
export class UpdateAdjunctUseCase implements IUpdateAdjunctUseCase {
  constructor(
    @Inject(IAdjunctRepository)
    private readonly adjunctRepo: IAdjunctRepository,
  ) {}

  async execute(id: string, dto: UpdateAdjunctDto): Promise<AdjunctEntity> {
    const adjunct = await this.adjunctRepo.findById(id);
    if (!adjunct) {
      throw new NotFoundException(`Adjunto com id ${id} não encontrado.`);
    }

    adjunct.surname = dto.surname;
    return this.adjunctRepo.update(adjunct);
  }
}
