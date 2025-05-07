import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { Inject, Injectable } from '@nestjs/common';
import { TokenResponseDto } from '../api/dto/token.response.dto';

@Injectable()
export class GetAllTokenUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(): Promise<TokenResponseDto[]> {
    return await this.tokenRepository.findAll();
  }
}
