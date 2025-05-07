import { ICreatetoken, IViewToken } from '@/domain/types/token';

export interface ICreateTokenUseCase {
  execute(dto: ICreatetoken): Promise<IViewToken>;
}

export const ICreateTokenUseCase = Symbol('ICreateTokenUseCase');
