import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { IUpdateTokenUseCase } from '@/domain/interfaces/use-cases/tokens/update.token.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateTokenDto } from '../api/dto/update-token.dto';

@Injectable()
export class UpdateTokenUseCase implements IUpdateTokenUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: string, dto: UpdateTokenDto) {
    return this.tokenRepository.update(id, dto);
  }
}
