import { IUpdateToken, IViewToken } from '@/domain/types/token';

export interface IUpdateTokenUseCase {
  execute(id: string, dto: IUpdateToken): Promise<IViewToken>;
}

export const IUpdateTokenUseCase = Symbol('IUpdateTokenUseCase');
