import { IExtractExternal } from '@/domain/interfaces/external/extract.external';
import { IGetExtractByWalletIdUseCase } from '@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractResponseDto } from '../api/dto/extract.reponse.dto';
import { ExtractRequestDto } from '../api/dto/extract.request.dto';

@Injectable()
export class GetExtractByWalletIdUseCase implements IGetExtractByWalletIdUseCase {
  constructor(
    @Inject(IExtractExternal)
    private readonly extractExternal: IExtractExternal,
  ) {}

  async execute(query: ExtractRequestDto): Promise<ExtractResponseDto> {
    return await this.extractExternal.getExtractByWalletId(query);
  }
}
