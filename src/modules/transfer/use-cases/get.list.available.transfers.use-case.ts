
import { TransferStatusEnum } from "@/domain/enums/transfer.status.enum";
import { ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { IGetListAvailableTransferUseCase } from "@/domain/interfaces/use-cases/transfer/get.list.available.transfer.use-case";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class GetListAvailableTransfersUseCase implements IGetListAvailableTransferUseCase {
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