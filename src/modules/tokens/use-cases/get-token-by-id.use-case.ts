import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { TOKEN_REPOSITORY } from '../token.symbols';
import { TokenResponseDto } from '../api/dto/token.response.dto';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class GetTokenByIdUseCase {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: number): Promise<TokenResponseDto> {
    const token = await this.tokenRepository.findById(id);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    return {
      id: token.id,
      name: token.name,
      hash: token.hash,
      description: token.description,
      maturityTimeDays: token.maturityTimeDays,
      yieldPercentage: token.yieldPercentage,
      isActive: token.isActive,
      yieldInterval: token.yieldInterval as number | null,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    };
  }
}

export class GetTokenByIdDto {
  @ApiProperty({ description: 'ID of the token to retrieve', example: '1' })
  id: string;
}
