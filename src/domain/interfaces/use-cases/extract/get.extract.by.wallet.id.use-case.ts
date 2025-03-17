import { ExtractResponseDto } from "@/modules/extract/api/dto/extract.reponse.dto";

export interface IGetExtractByWalletIdUseCase {
  execute(walletId: number, username: string, limit: number): Promise<ExtractResponseDto>;
}

export const IGetExtractByWalletIdUseCase = Symbol('IGetExtractByWalletIdUseCase');
