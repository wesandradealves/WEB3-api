import { IQuotationExternal } from '@/domain/interfaces/external/quotation.external';
import { IGetQuotationsUseCase } from '@/domain/interfaces/use-cases/quotations/get.quotations.use-case';
import { Inject, Injectable } from "@nestjs/common";
import { GetQuotationsResponseDto } from '../api/dto/get.quotations.response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/domain/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetQuotationUseCase implements IGetQuotationsUseCase {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    @Inject(IQuotationExternal)
    private readonly quotationRepository: IQuotationExternal,
  ) {}

  async execute(email: string): Promise<GetQuotationsResponseDto> {
    let user = await this.user.findOneBy({ email });
    return await this.quotationRepository.getQuotations(user.userBdmId);
  }
}