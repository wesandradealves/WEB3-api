import { GetQuotationsResponseDto } from '@/modules/quotations/api/dto/get.quotations.response.dto';

export interface IGetQuotationsUseCase {
  execute(email: string): Promise<GetQuotationsResponseDto>;
}

export const IGetQuotationsUseCase = Symbol('IGetQuotationsUseCase');
