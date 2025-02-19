import { ICreateUser, IUpdateUser, IViewUser } from '@/domain/types/user';
import { UpdateResult } from 'typeorm';

export interface IUserRepository {
  create(data: ICreateUser): Promise<ICreateUser>;
  update(id: string, data: IUpdateUser): Promise<UpdateResult>;
  delete(id: string): Promise<any>;
  listOne(id: string): Promise<IViewUser>;
  listAll(): Promise<IViewUser[]>;
}

export const IUserRepository = Symbol('IUserRepository');
