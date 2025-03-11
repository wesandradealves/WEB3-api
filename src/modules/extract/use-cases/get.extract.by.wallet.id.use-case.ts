import { IExtractRepository } from "@/domain/interfaces/repositories/extract.repository";
import { IGetExtractByWalletIdUseCase } from "@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ExtractResponseDto } from "../api/dto/extract.reponse.dto";

@Injectable()
export class GetExtractByWalletIdUseCase implements IGetExtractByWalletIdUseCase {
  constructor(
    @Inject(IExtractRepository)
    private readonly extractRepository: IExtractRepository,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(GetExtractByWalletIdUseCase.name);
  }

  async execute(walletId: number, username: string, limit: number): Promise<ExtractResponseDto> {
    this.logger.log(walletId);
    const result =  await this.extractRepository.getExtractByWalletId(walletId, username, limit);
    return result
  }
}
