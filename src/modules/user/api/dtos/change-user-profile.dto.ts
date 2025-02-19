import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeUserProfileRequestDto {
  @IsEnum(ProfileUserEnum)
  @IsNotEmpty()
  profile: ProfileUserEnum;
}
