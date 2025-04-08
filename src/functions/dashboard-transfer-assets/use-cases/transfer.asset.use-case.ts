
import { ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { ITransferAssetUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.asset.user-case";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class TransferAssetUseCase implements ITransferAssetUseCase {
  constructor(
    @Inject(ITransferAssetRepository)
    private readonly transferRepository: ITransferAssetRepository,
  ){}
  
  async execute(body: any): Promise<any> {
    return await this.transferRepository.processTransfer(body)
  }
}