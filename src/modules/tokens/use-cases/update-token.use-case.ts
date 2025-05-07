import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateTokenDto } from '../api/dto/update-token.dto';

@Injectable()
export class UpdateTokenUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(id: string, dto: UpdateTokenDto) {
    return this.tokenRepository.update(id, dto);
  }
}
