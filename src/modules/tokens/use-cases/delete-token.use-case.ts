import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { IDeleteTokenUseCase } from '@/domain/interfaces/use-cases/tokens/delete.token.use-case';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DeleteTokenUseCase implements IDeleteTokenUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.tokenRepository.delete(id);
  }
}
