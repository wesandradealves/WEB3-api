import { IBdmExternal } from "@/domain/interfaces/external/bdm.external";
import { ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { ITransferUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.user-case";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class TransferUseCase implements ITransferUseCase{
  constructor(
    @Inject(ITransferAssetRepository)
    private readonly transferRepository: ITransferAssetRepository,
    @Inject(IUserRepository)
    private readonly userRepository: IUserRepository,
    @Inject(IBdmExternal)
    private readonly bdmExternal: IBdmExternal,
  ){}

  async execute(content: any, userId: string): Promise<any> {
    try{      
      const user = await this.userRepository.listOne(userId);
      const senderBdmUserDatabyWalletId =  await this.bdmExternal.getBdmUserDataByEmail(user.email);
      const senderWalletData =  await this.bdmExternal.findDefaultWalletByUserId(senderBdmUserDatabyWalletId.id);

      return this.transferRepository.transfer(content, 
        {senderEmail: user.email , senderWalletAddress:senderWalletData.address, senderWalletId: senderWalletData.id}
      )
    }catch(error){

    }
  }
}