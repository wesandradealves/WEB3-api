import { ICreateUser, IUpdateUser, IViewUser } from '@/domain/types/user';

export interface IUserRepository {
  create(data: ICreateUser): Promise<IViewUser>;
  update(id: string, data: IUpdateUser): Promise<void>;
  delete(id: string): Promise<void>;
  listOne(id: string): Promise<IViewUser>;
  listAll(): Promise<IViewUser[]>;
}

export const IUserRepository = Symbol('IUserRepository');
