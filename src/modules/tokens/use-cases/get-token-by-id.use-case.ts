import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { TokenResponseDto } from '../api/dto/token.response.dto';

@Injectable()
export class GetTokenByIdUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: string): Promise<TokenResponseDto> {
    return await this.tokenRepository.findById(id);
  }
}

export class GetTokenByIdDto {
  @ApiProperty({ description: 'ID of the token to retrieve', example: '1' })
  id: string;
}
