import { ItransactionsRepository } from "@/domain/interfaces/repositories/transactions.repository";
import { Inject, Injectable } from "@nestjs/common";
import { HttpBdmProvider } from "../providers/http/http.bdm.provider";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/domain/entities/user.entity";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { TransactionsDto } from "@/modules/transactions/api/dtos/transactions.dto";

@Injectable()
export class TransactionsRepository implements ItransactionsRepository {
  private readonly bdmVersion: string;
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    @Inject(HttpBdmProvider)
    private readonly httpBdmProvider: HttpBdmProvider,
    private readonly configService: ConfigService,
  ) {
    this.bdmVersion = this.configService.get<string>('bdm.version');
   }

  async getTransactionsByWalletId(data: TransactionsDto): Promise<any> {
    let user = await this.user.findOneBy({ email: data.username });

    const result = await this.httpBdmProvider.fetchData({
      url: `/${this.bdmVersion}/history/transactions-by-wallet/${data.walletId}`,
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'payload':`payload: custom:id:${user.userBdmId}]`
       },
    })

    return result;
  }

}