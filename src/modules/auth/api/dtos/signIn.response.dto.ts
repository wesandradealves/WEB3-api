import { ISignInResponse } from '@/domain/interfaces/auth/auth.external';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto implements ISignInResponse {
  @ApiProperty({ description: 'Authentication status', example: true })
  @Expose()
  auth: boolean;

  @ApiProperty({ description: 'Token expiration time in seconds', example: 3600 })
  @Expose()
  expires: number;

  @ApiProperty({ description: 'JWT token', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @Expose()
  tokenJwt: string;

  @ApiProperty({ description: 'Refresh token', example: 'dGhpc2lzYXJlZnJlc2h0b2tlbg==' })
  @Expose()
  refreshToken: string;
}