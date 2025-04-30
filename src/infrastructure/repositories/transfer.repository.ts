import { DashboardTransferList } from "@/domain/entities/transfer.assets.entity";
import { ISenderTransferData, ITransferAssetRepository } from "@/domain/interfaces/repositories/transfer.repository";
import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { SqsProvider } from "../providers/aws/sqs/sqs.provider";
import { IBdmExternal } from "@/domain/interfaces/external/bdm.external";
import { IBlockchainExternal } from "@/domain/interfaces/external/blockchain.external";
import { TransferStatusEnum } from "@/domain/commons/enum/transfer.status.enum";
import { SQSDeleteParams, SQSMessage, TransferPayload, TransferQueueItem, TransferResult } from "@/domain/interfaces/functions/process.transfer.interface";


@Injectable()
export class TransferRepository implements ITransferAssetRepository{
  private awsSqsUrl: string;
  constructor(
    @InjectRepository(DashboardTransferList)
    private readonly dashboardTransferList: Repository<DashboardTransferList>,
    private readonly sqsProvider: SqsProvider,
    @Inject(IBdmExternal)
    private readonly bdmExternal: IBdmExternal,
    @Inject(IBlockchainExternal)
    private readonly blockchainExternal: IBlockchainExternal,
  ) {
    this.awsSqsUrl = process.env.AWS_SQS_TRANSFER_URL;
  }

  async getListAvailableTransfers(email: string, status: TransferStatusEnum): Promise<any> {
    try {
      const response = await this.dashboardTransferList.find({
        where: { email, status },
      });
      return response;
    } catch (error) {
      console.error("Error in getListAvailableTransfers method:", error);
      throw error;
    }
  }

  async transfer(ids: string[], user: ISenderTransferData ): Promise<any> {
    try {
      //dados de quem envia
      let notFoundIds: string[];

      //dados de quem vai receber
      const userReciptData = await this.dashboardTransferList.findBy({ id: In(ids) });
      const foundIds = userReciptData.map(item => item.id);
      if(foundIds.length > 0) {
        notFoundIds = ids.filter(id => !foundIds.includes(id.toString()));

        const objectToQueue = userReciptData.map(item => ({
          transferId: item.id,
          asset: item.asset,
          recipetName: item.name,
          recipetWallet: item.wallet,
          recipetId: item.wallet,
          recipetEmail: item.email,
          amount: item.amount,
          senderEmail: user.senderEmail,
          senderDefaultWalletAddress: user.senderWalletAddress,
          senderWalletId: user.senderWalletId,
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

  async processTransfer(message: SQSMessage): Promise<TransferResult> {
    try {
      const body = JSON.parse(message.Records[0].body) as TransferQueueItem[];
      const totalAssetAmount = body.reduce((sum: number, item: TransferQueueItem) => 
        sum + Number(item.amount), 0);
      const result = await this.blockchainExternal.getBDMBalance(body[0].senderDefaultWalletAddress);
  
      if (result.balance < totalAssetAmount) {
        return { status: 400, message: 'Saldo insuficiente' };
      }
      
      for (const item of body) {
        //TODO: ajustar rota para ajustar carteira padrão
        const recipetBdmUserDatabyWalletId = await this.bdmExternal.getBdmUserDataByEmail(item.recipetEmail);
        const recipetWalletData = await this.bdmExternal.findDefaultWalletByUserId(recipetBdmUserDatabyWalletId.id);
  
        const transferPayload: TransferPayload = {
          wallet_id: item.senderWalletId,
          destination_user_id: Number(item.recipetWallet),
          destination_wallet_id: recipetWalletData.id,
          amount: Number(item.amount),
          destination_company_id: 1,
          company_id: 1,
          asset: item.asset
        };
        
        try {
          await this.bdmExternal.transferAsset(transferPayload);
          await this.dashboardTransferList.update({ id: item.transferId }, { status: TransferStatusEnum.COMPLETED });
        } catch(err) {
          await this.dashboardTransferList.update({ id: item.transferId }, { status: TransferStatusEnum.FAILED });
          return { status: 400, message: 'Erro ao transferir ativos' };
        }
      }
      
      const deleteMessage: SQSDeleteParams = {
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