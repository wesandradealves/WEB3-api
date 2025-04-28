import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';
import { ICreateUser } from '@/domain/types/user';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

export class CreateUserRequestDto implements ICreateUser {
  @ApiProperty({
    description: 'Email of the user',
    example: 'jondue@email.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Type profile of the user',
    example: ProfileUserEnum.USER,
    enum: ProfileUserEnum,
  })
  @IsEnum(ProfileUserEnum)
  @IsNotEmpty()
  profile: ProfileUserEnum;
}
