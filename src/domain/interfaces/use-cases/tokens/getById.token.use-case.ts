import { IViewToken } from '@/domain/types/token';

export interface IGetTokenByIdUseCase {
  execute(id: string): Promise<IViewToken>;
}
export const IGetTokenByIdUseCase = Symbol('IGetTokenByIdUseCase');
