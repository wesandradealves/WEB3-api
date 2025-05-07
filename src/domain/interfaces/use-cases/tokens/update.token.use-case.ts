import { IUpdateToken } from '@/domain/types/token';

export interface IUpdateTokenUseCase {
  execute(id: string, dto: IUpdateToken): Promise<void>;
}

export const IUpdateTokenUseCase = Symbol('IUpdateTokenUseCase');
