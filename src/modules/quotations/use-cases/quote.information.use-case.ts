import { IQuotationExternal } from "@/domain/interfaces/external/quotation.external";
import { IQuoteInformationUseCase } from "@/domain/interfaces/use-cases/quotations/quote.information.use-case";
import { Inject, Injectable } from "@nestjs/common";
import { QuotationInformationResponseDto } from "../api/dto/quote.information.response.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/domain/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class QuoteInformationUseCase implements IQuoteInformationUseCase {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    @Inject(IQuotationExternal)
    private readonly quotationRepository: IQuotationExternal,
  ) {}

  async execute(email: string, asset: string): Promise<QuotationInformationResponseDto> {
    let user = await this.user.findOneBy({ email });
    return await this.quotationRepository.getQuoteInformation(user.userBdmId, asset);
  }
}