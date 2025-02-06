import { IUpdateUser } from '@/domain/types/user';

export interface IUpdateUseCase {
  execute(id: string, data: IUpdateUser): Promise<void>;
}

export const IUpdateUseCase = Symbol('IUpdateUseCase');
