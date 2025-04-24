import { AdjunctEntity } from '@/domain/entities/adjunct.entity';

export interface IFindOneAdjunctUseCase {
  execute(id: string): Promise<AdjunctEntity>;
}
export const IFindOneAdjunctUseCase = Symbol('IFindOneAdjunctUseCase');
