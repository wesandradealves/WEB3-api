import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { IGetAllTokenUseCase } from '@/domain/interfaces/use-cases/tokens/getAll.token.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { TokenResponseDto } from '../api/dto/token.response.dto';

@Injectable()
export class GetAllTokenUseCase implements IGetAllTokenUseCase {
  constructor(
    @Inject(ITokenRepository)
    private readonly tokenRepository: ITokenRepository,
  ) {}

  async execute(): Promise<TokenResponseDto[]> {
    return await this.tokenRepository.findAll();
  }
}
