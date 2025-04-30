
import { TransferStatusEnum } from "@/domain/commons/enum/transfer.status.enum";
import { ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { IGetAvailableTransferUseCase } from "@/domain/interfaces/use-cases/transfer/get.available.transfer.use-case";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetAvailableTransfersUseCase implements IGetAvailableTransferUseCase {
  constructor(
    @Inject(ITransferAssetRepository)
    private readonly transferRepository: ITransferAssetRepository,  
  ){}

  async execute(email: string, status?: TransferStatusEnum): Promise<any> {
    if(status){
      return await this.transferRepository.getListAvailableTransfers(email, status);
    }
    return await this.transferRepository.getListAvailableTransfers(email, TransferStatusEnum.PENDING);
  }
}