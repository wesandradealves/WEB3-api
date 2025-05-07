import { IViewToken } from '@/domain/types/token';

export interface IGetAllTokenUseCase {
  execute(): Promise<IViewToken[]>;
}
export const IGetAllTokenUseCase = Symbol('IGetAllTokenUseCase');
