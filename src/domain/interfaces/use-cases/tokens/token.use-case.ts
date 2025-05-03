// Interfaces para uso opcional em testes, mocks ou desacoplamento completo
import { CreateTokenDto } from 'src/modules/tokens/api/dto/create-token.dto';
import { UpdateTokenDto } from 'src/modules/tokens/api/dto/update-token.dto';
import { TokenResponseDto } from 'src/modules/tokens/api/dto/token.response.dto';

export interface ICreateTokenUseCase {
  execute(dto: CreateTokenDto): Promise<TokenResponseDto>;
}

export interface IGetAllTokensUseCase {
  execute(): Promise<TokenResponseDto[]>;
}

export interface IGetTokenByIdUseCase {
  execute(id: string): Promise<TokenResponseDto>;
}

export interface IUpdateTokenUseCase {
  execute(id: string, dto: UpdateTokenDto): Promise<TokenResponseDto>;
}

export interface IDeleteTokenUseCase {
  execute(id: string): Promise<void>;
}
