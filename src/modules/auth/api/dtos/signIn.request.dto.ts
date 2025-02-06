import { ISignInRequest } from '@/domain/interfaces/auth/auth.external';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequestDto implements ISignInRequest {
  @IsNotEmpty()
  @IsEmail()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
