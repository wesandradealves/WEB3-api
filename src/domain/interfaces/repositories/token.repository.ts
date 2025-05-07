import { ICreatetoken, IUpdateToken, IViewToken } from '@/domain/types/token';

export interface ITokenRepository {
  create(token: ICreatetoken): Promise<IViewToken>;
  findAll(): Promise<IViewToken[]>;
  findById(id: string): Promise<IViewToken>;
  update(id: string, token: IUpdateToken): Promise<void>;
  delete(id: string): Promise<void>;
}
export const ITokenRepository = Symbol('ITokenRepository');
