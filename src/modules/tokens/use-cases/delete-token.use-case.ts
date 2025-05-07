import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TOKEN_REPOSITORY } from '../token.symbols';
import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { ApiProperty } from '@nestjs/swagger';

@Injectable()
export class DeleteTokenUseCase {
  constructor(
    @Inject(TOKEN_REPOSITORY)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  @ApiProperty({ description: 'ID of the token to delete', example: '1' })
  async execute(id: string): Promise<void> {
    const token = await this.tokenRepository.findById(id);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    await this.tokenRepository.delete(id);
  }
}
