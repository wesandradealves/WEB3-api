import { ISignInResponse } from '@/domain/interfaces/auth/auth.external';
import { Expose } from 'class-transformer';

export class SignInResponseDto implements ISignInResponse {
  @Expose()
  auth: boolean;

  @Expose()
  expires: number;

  @Expose()
  tokenJwt: string;

  @Expose()
  refreshToken: string;
}
