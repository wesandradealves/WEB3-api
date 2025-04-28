import { UpdateAdjunctDto } from '@/modules/adjunct/api/dtos/update.adjunct.dto';
import { AdjunctEntity } from '@/domain/entities/adjunct.entity';

export interface IUpdateAdjunctUseCase {
  execute(id: string, dto: UpdateAdjunctDto): Promise<AdjunctEntity>;
}
export const IUpdateAdjunctUseCase = Symbol('IUpdateAdjunctUseCase');
