import { CreateAdjunctDto } from '@/modules/adjunct/api/dtos/create-adjunct.dto';

export interface ICreateAdjunctUseCase {
  execute(dto: CreateAdjunctDto): Promise<any>;
}

export const ICreateAdjunctUseCase = Symbol('ICreateAdjunctUseCase');
