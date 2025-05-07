import { PrefixTokenEntity } from '../entities/prefix.token.entity';

export type ICreatetoken = Omit<
  PrefixTokenEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isActive'
>;

export type IUpdateToken = Omit<
  PrefixTokenEntity,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type IViewToken = PrefixTokenEntity;
