import { QuotationInformationResponseDto } from '@/modules/quotations/api/dto/quote.information.response.dto';

export interface IQuoteInformationUseCase {
  execute(email: string, asset: string): Promise<QuotationInformationResponseDto>;
}

export const IQuoteInformationUseCase = Symbol('IQuoteInformationUseCase');
