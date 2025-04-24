import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateAdjunctDto {
  @IsEmail()
  email: string;

  @IsString()
  nickname: string;

  @IsUUID()
  representativeId: string;
}
