import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTokenDto } from '../api/dto/update-token.dto';
import { TOKEN_REPOSITORY } from '../token.symbols';
import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';

@Injectable()
export class UpdateTokenUseCase {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: number, dto: UpdateTokenDto) {
    const token = await this.tokenRepository.findById(id);
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    Object.assign(token, dto);
    return this.tokenRepository.update(token);
  }
}
