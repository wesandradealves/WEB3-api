
import { ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { ITransferUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.user-case";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class TransferUseCase implements ITransferUseCase{
  constructor(
    @Inject(ITransferAssetRepository)
    private readonly transferRepository: ITransferAssetRepository,  
  ){}

  async execute(content: any, user: any): Promise<any> {
    let result = await this.transferRepository.transfer(content, user)
    return result;
  }
}