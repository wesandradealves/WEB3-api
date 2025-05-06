import { Module } from "@nestjs/common";
import { GetQuotationUseCase } from "./use-cases/get.quotations.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@/domain/entities/user.entity";
import { QuoteInformationUseCase } from "./use-cases/quote.information.use-case";
import { QuotationsController } from "./api/controller/quotations.controller";
import { IQuotationExternal } from "@/domain/interfaces/external/quotation.external";
import { QuotationExternal } from "@/infrastructure/external/quotation.external";
import { IGetQuotationsUseCase } from "@/domain/interfaces/use-cases/quotations/get.quotations.use-case";
import { IQuoteInformationUseCase } from "@/domain/interfaces/use-cases/quotations/quote.information.use-case";
import { HttpBdmModule } from "@/infrastructure/providers/http/bdm/http.bdm.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    HttpBdmModule,
  ],
  controllers: [QuotationsController],
  providers: [
    {
      provide: IQuotationExternal,
      useClass: QuotationExternal,
    },
    {
      provide: IGetQuotationsUseCase,
      useClass: GetQuotationUseCase,
    },
    {
      provide: IQuoteInformationUseCase,
      useClass: QuoteInformationUseCase,
    }
  ]
})
export class QuotationModule {}
