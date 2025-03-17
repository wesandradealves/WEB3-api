import { IExtractRepository } from "@/domain/interfaces/repositories/extract.repository";
import { IGetExtractByWalletIdUseCase } from "@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ExtractResponseDto } from "../api/dto/extract.reponse.dto";
import { ExtractDto } from "../api/dto/extract.dto";

@Injectable()
export class GetExtractByWalletIdUseCase implements IGetExtractByWalletIdUseCase {
  constructor(
    @Inject(IExtractRepository)
    private readonly extractRepository: IExtractRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(GetExtractByWalletIdUseCase.name);
  }

  async execute(data: ExtractDto): Promise<ExtractResponseDto> {
    this.logger.log(data);
    const result =  await this.extractRepository.getExtractByWalletId(data);
    return result
  }
}
