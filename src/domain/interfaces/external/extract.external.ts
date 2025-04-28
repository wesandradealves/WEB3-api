import { ExtractRequestDto } from '@/modules/extract/api/dto/extract.request.dto';

export interface IExtractExternal {
  getExtractByWalletId(query: ExtractRequestDto): Promise<any>;
}

export const IExtractExternal = Symbol('IExtractExternal');
