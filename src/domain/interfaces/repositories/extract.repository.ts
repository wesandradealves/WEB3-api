import { IExtractDto } from "../dto/extract/extract.dto";

export interface IExtractRepository {
  getExtractByWalletId(data: IExtractDto): Promise<any>;
}


export const IExtractRepository = Symbol('IExtractRepository');
