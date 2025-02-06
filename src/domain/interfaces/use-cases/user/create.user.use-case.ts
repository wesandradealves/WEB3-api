import { ICreateUser, IViewUser } from '@/domain/types/user';

export interface ICreateUserUseCase {
  execute(data: ICreateUser): Promise<IViewUser>;
}

export const ICreateUserUseCase = Symbol('ICreateUserUseCase');
