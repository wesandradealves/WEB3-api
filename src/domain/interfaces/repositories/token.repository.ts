import { PrefixTokenEntity } from 'src/domain/entities/prefix.token.entity';

export interface ITokenRepository {
  create(token: PrefixTokenEntity): Promise<PrefixTokenEntity>;
  findAll(): Promise<PrefixTokenEntity[]>;
  findById(id: number): Promise<PrefixTokenEntity | null>;
  update(token: PrefixTokenEntity): Promise<PrefixTokenEntity>;
  delete(id: number): Promise<void>;
}

export const ITokenRepository = Symbol('ITokenRepository');
