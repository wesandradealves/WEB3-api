import { UserEntity } from '../entities/user.entity';

export type ICreateUser = Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isActive' | 'isAdmin' | 'cpfCnpj' | 'passport' | 'userBdmId' | 'userMarketId' | 'name'>;
export type IUpdateUser = UserEntity;
export type IViewUser = UserEntity;
