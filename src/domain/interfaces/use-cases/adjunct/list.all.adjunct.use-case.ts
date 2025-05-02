import { AdjunctEntity } from '@/domain/entities/adjunct.entity';

export interface IListAllAdjunctsUseCase {
  execute(): Promise<AdjunctEntity[]>;
}
export const IListAllAdjunctsUseCase = Symbol('IListAllAdjunctsUseCase');
