import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ChangeUserProfileRequestDto {
  @ApiProperty({
    description: 'Type profile of the user',
    example: ProfileUserEnum.USER,
    enum: ProfileUserEnum,
  })
  @IsEnum(ProfileUserEnum)
  @IsNotEmpty()
  profile: ProfileUserEnum;
}
