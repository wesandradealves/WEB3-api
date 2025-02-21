import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';
import { ICreateUser } from '@/domain/types/user';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserRequestDto implements ICreateUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ProfileUserEnum)
  @IsNotEmpty()
  profile: ProfileUserEnum;
}
