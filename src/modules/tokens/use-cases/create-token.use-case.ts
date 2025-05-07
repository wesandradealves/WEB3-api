import { Inject, Injectable } from '@nestjs/common';
import { CreateTokenDto } from '../api/dto/create-token.dto';
import { PrefixTokenEntity } from 'src/domain/entities/prefix.token.entity';
import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { TOKEN_REPOSITORY } from '../token.symbols';

@Injectable()
export class CreateTokenUseCase {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(dto: CreateTokenDto): Promise<PrefixTokenEntity> {
    const token = new PrefixTokenEntity();
    token.name = dto.name;
    token.hash = dto.hash;
    token.description = dto.description;
    token.maturityTimeDays = dto.maturityTimeDays;
    token.yieldPercentage = dto.yieldPercentage;
    token.isActive = dto.isActive;
    token.yieldInterval =
      Array.isArray(dto.yieldInterval) && dto.yieldInterval.length > 0
        ? dto.yieldInterval[0]
        : null;

    return this.tokenRepository.create(token);
  }
}
