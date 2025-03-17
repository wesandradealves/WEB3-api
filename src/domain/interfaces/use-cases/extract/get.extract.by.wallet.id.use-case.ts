import { ExtractResponseDto } from "@/modules/extract/api/dto/extract.reponse.dto";
import { IExtractDto } from "../../dto/extract/extract.dto";

export interface IGetExtractByWalletIdUseCase {
  execute(data: IExtractDto): Promise<ExtractResponseDto>;
}

export const IGetExtractByWalletIdUseCase = Symbol('IGetExtractByWalletIdUseCase');
