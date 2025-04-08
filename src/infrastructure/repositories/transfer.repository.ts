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
          recipetEmail: item.email,
          amount: item.amount,
          senderEmail: userSenderData.email,
          senderDefaultWalletAddress: senderWalletData.address,
        }));
        
        this.sqsProvider.sendMessage(this.awsSqsUrl, objectToQueue);;
        console.log('mensagem enviada para fila')
      }else{
        return { status: 404, message: 'Nenhum id encontrado' };
      }

      
      return { status: 200, notFoundIds };
    } catch (error) {
      console.error("Error in transfer method:", error);
      throw error;
    }
  }

  async processTransfer(body: any): Promise<any> {
    try {
      const teste = await this.blockchainExternal.getBDMBalance(body[0].senderDefaultWalletAddress);
      console.log(teste)
  } catch (error) {
      console.error("Error in processTransfer method:", error);
    }
  }
}