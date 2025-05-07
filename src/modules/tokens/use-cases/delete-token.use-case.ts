import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteTokenUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.tokenRepository.delete(id);
  }
}
