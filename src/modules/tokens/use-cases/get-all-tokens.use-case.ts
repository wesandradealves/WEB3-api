import { Inject, Injectable } from '@nestjs/common';
import { ITokenRepository } from 'src/domain/interfaces/repositories/token.repository.interface';
import { TOKEN_REPOSITORY } from '../token.symbols';
import { TokenResponseDto } from '../api/dto/token.response.dto';

@Injectable()
export class GetAllTokensUseCase {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(): Promise<TokenResponseDto[]> {
    const tokens = await this.tokenRepository.findAll();
    return tokens.map((token) => ({
      id: token.id,
      name: token.name,
      hash: token.hash,
      description: token.description,
      maturityTimeDays: token.maturityTimeDays,
      yieldPercentage: token.yieldPercentage,
      isActive: token.isActive,
      yieldInterval: Array.isArray(token.yieldInterval) ? token.yieldInterval[0] : token.yieldInterval,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt,
    }));
  }
}
