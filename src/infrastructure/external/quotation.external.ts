import { IQuotationExternal } from '@/domain/interfaces/external/quotation.external';
import { Inject, Injectable } from '@nestjs/common';
import { HttpBdmProvider } from '../providers/http/http.bdm.provider';
import { GetQuotationsResponseDto } from '@/modules/quotations/api/dto/get.quotations.response.dto';
import { QuotationInformationResponseDto } from '@/modules/quotations/api/dto/quote.information.response.dto';

@Injectable()
export class QuotationExternal implements IQuotationExternal {
  constructor(
    @Inject(HttpBdmProvider)
    private readonly httpBdmProvider: HttpBdmProvider,
  ) {}

  async getQuotations(userBdmId: number): Promise<GetQuotationsResponseDto> {
    const result: GetQuotationsResponseDto = await this.httpBdmProvider.fetchData({
      url: `/quotations/sellable-tokens`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        payload: `custom:id:${userBdmId}]`,
      },
    });

    return result;
  }

  async getQuoteInformation(
    userBdmId: number,
    asset: string,
  ): Promise<QuotationInformationResponseDto> {
    const result: QuotationInformationResponseDto = await this.httpBdmProvider.fetchData({
      url: `/quotation/all/${asset}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        payload: `custom:id:${userBdmId}]`,
      },
    });

    return result;
  }
}
