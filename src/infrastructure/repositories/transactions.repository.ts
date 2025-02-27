import { ItransactionsRepository } from "@/domain/interfaces/repositories/transactions.repository";
import { Inject, Injectable } from "@nestjs/common";
import { HttpBdmProvider } from "../providers/http/http.bdm.provider";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@/domain/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class TransactionsRepository implements ItransactionsRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    @Inject(HttpBdmProvider)
    private readonly httpBdmProvider: HttpBdmProvider,
  ) { }

  async getTransactionsByWalletId(walletId: number, username: string): Promise<any> {
    const data = walletId
    let user = await this.user.findOneBy({ email: username });

    const result = await this.httpBdmProvider.fetchData({
      url: `/v25/history/transactions-by-wallet/${data}`,
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'payload':`payload: custom:id:${user.userBdmId}]`
       },
    })

    return result;
  }

}