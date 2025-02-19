import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ProfileUserEnum)
  @IsNotEmpty()
  profile: ProfileUserEnum;
}
