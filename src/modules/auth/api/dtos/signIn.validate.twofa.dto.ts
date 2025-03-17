import { ISignInTwoFaRequest } from '@/domain/interfaces/auth/auth.external';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInValidateTwoFaDto implements ISignInTwoFaRequest {
  @ApiProperty({ description: 'The email of the user', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @ApiProperty({ description: 'The 2FA code', example: '123456' })
  @IsNotEmpty()
  @IsNumber()
  twofa: number;
}