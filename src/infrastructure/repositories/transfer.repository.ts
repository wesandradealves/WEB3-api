import { DashboardTransferList } from "@/domain/entities/dashboard-transfer-list.entity";
import { ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { SqsProvider } from "../providers/aws/sqs/sqs.provider";
import { UserEntity } from "@/domain/entities/user.entity";
import { IBdmExternal } from "@/domain/interfaces/external/bdm.external";
import { IBlockchainExternal } from "@/domain/interfaces/external/blockchain.external";


@Injectable()
export class TransferRepository implements ITransferAssetRepository{
  private awsSqsUrl: string;
  constructor(
    @InjectRepository(DashboardTransferList)
    private readonly dashboardTransferList: Repository<DashboardTransferList>,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    private readonly sqsProvider: SqsProvider,
    @Inject(IBdmExternal)
    private readonly bdmExternal: IBdmExternal,
    @Inject(IBlockchainExternal)
    private readonly blockchainExternal: IBlockchainExternal,
  ) {
    this.awsSqsUrl = process.env.AWS_SQS_TRANSFER_URL;
  }

  async transfer(ids: string[], user: any ): Promise<any> {
    try {
      //dados de quem envia
      let notFoundIds: string[];
      const userSenderData =  await this.userEntity.findOne({where: { id: user.userId }})
      const senderBdmUserDatabyWalletId =  await this.bdmExternal.getBdmUserDataByEmail(userSenderData.email);
      const senderWalletData =  await this.bdmExternal.findDefaultWalletByUserId(senderBdmUserDatabyWalletId.id);

      //dados de quem vai receber
      const userReciptData = await this.dashboardTransferList.findBy({ id: In(ids) });
      const foundIds = userReciptData.map(item => item.id);
      if(foundIds.length > 0) {
        notFoundIds = ids.filter(id => !foundIds.includes(id.toString()));

        const objectToQueue = userReciptData.map(item => ({
          asset: item.asset,
          recipetName: item.name,
          recipetWallet: item.wallet,
          recipetId: item.wallet,
          recipetEmail: item.email,
          amount: item.amount,
          senderEmail: userSenderData.email,
          senderDefaultWalletAddress: senderWalletData.address,
          senderWalletId: senderWalletData.id,
        }));
        
        this.sqsProvider.sendMessage(this.awsSqsUrl, objectToQueue);;

      }else{
        return { status: 404, message: 'Nenhum id encontrado' };
      }

      return { status: 200, notFoundIds };
    } catch (error) {
      console.error("Error in transfer method:", error);
      throw error;
    }
  }

  async processTransfer(message: any): Promise<any> {
    try {
      const body = JSON.parse(message.Records[0].body);
      const totalAssetAmount = body.reduce((sum: any, item: any) => sum + Number(item.amount), 0);
      const result = await this.blockchainExternal.getBDMBalance(body[0].senderDefaultWalletAddress);
  
      if (result.balance < totalAssetAmount) {
        return { status: 400, message: 'Saldo insuficiente' };
      }
      
      for (const item of body) {
        const recipetBdmUserDatabyWalletId = await this.bdmExternal.getBdmUserDataByEmail(item.recipetEmail);
        const recipetWalletData = await this.bdmExternal.findDefaultWalletByUserId(recipetBdmUserDatabyWalletId.id);
  
        const transferPayload = {
          wallet_id: item.senderWalletId,
          destination_user_id: Number(item.recipetWallet),
          destination_wallet_id: recipetWalletData.id,
          amount: Number(item.amount),
          destination_company_id: 1,
          company_id: 1,
          asset: item.asset
        }
        
        await this.bdmExternal.transferAsset(transferPayload);
      }
      
      const deleteMessage = {
        ReceiptHandle: message.Records[0].receiptHandle,
        MessageId: message.Records[0].messageId
      };
      
      await this.sqsProvider.deleteMessage(this.awsSqsUrl, deleteMessage);
      return { status: 200, message: 'Mensagens processadas com sucesso' };
    } catch (error) {
      console.error("Error in processTransfer method:", error);
      throw error;
    }
  }
}