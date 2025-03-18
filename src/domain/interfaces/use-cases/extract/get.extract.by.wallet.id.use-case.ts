import { ExtractResponseDto } from '@/modules/extract/api/dto/extract.reponse.dto';
import { IExtractRequest } from '../../dto/extract/extract.request';

export interface IGetExtractByWalletIdUseCase {
  execute(query: IExtractRequest): Promise<ExtractResponseDto>;
}

export const IGetExtractByWalletIdUseCase = Symbol('IGetExtractByWalletIdUseCase');
