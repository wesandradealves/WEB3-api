import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';
import { IUpdateUser } from '@/domain/types/user';

export interface IUpdateUserUseCase {
  execute(
    id: string,
    profile?: ProfileUserEnum,
    isActive?: boolean
  ): Promise<IUpdateUser>;
}

export const IUpdateUseCase = Symbol('IUpdateUseCase');
