import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { ICreateTokenUseCase } from '@/domain/interfaces/use-cases/tokens/create.token.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { CreateTokenDto } from '../api/dto/create-token.dto';
import { TokenResponseDto } from '../api/dto/token.response.dto';

@Injectable()
export class CreateTokenUseCase implements ICreateTokenUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(dto: CreateTokenDto): Promise<TokenResponseDto> {
    return this.tokenRepository.create(dto);
  }
}
