import { IViewUser } from '@/domain/types/user';

export interface IListUserUseCase {
  execute(id: string): Promise<IViewUser[]>;
}

export const IListUserUseCase = Symbol('IListUserUseCase');
