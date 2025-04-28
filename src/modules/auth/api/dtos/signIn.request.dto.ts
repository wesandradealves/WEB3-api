import { ISignInRequest } from '@/domain/interfaces/auth/auth.external';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto implements ISignInRequest {
  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({ description: 'The password of the user', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}