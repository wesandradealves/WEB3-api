import { Inject, Injectable } from '@nestjs/common';
import { IAdjunctRepository } from '@/domain/interfaces/repositories/adjunct.repository';
import { IListAllAdjunctsUseCase } from '@/domain/interfaces/use-cases/adjunct/list.all.adjunct.use-case';
import { AdjunctEntity } from '@/domain/entities/adjunct.entity';

@Injectable()
export class ListAllAdjunctsUseCase implements IListAllAdjunctsUseCase {
  constructor(
    @Inject(IAdjunctRepository)
    private readonly adjunctRepo: IAdjunctRepository,
  ) {}

  async execute(): Promise<AdjunctEntity[]> {
    return this.adjunctRepo.findAll();
  }
}
