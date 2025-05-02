import { IsEmail, IsString, IsUUID } from 'class-validator';

export class CreateAdjunctDto {
  @IsEmail()
  email: string;

  @IsString()
  surname: string;

  @IsUUID()
  representativeId: string;
}
