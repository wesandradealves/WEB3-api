
import { UserEntity } from '@/domain/entities/user.entity';
import { IExtractRepository } from '@/domain/interfaces/repositories/extract.repository';
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpBdmProvider } from '../providers/http/http.bdm.provider';
import { ExtractResponseDto } from '@/modules/extract/api/dto/extract.reponse.dto';

@Injectable()
export class ExtractRepository implements IExtractRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    @Inject(HttpBdmProvider)
    private readonly httpBdmProvider: HttpBdmProvider,
  ) {
  }
  async getExtractByWalletId(walletId: number, username: string, limit: number): Promise<ExtractResponseDto> {
    const data = walletId
    const user = await this.user.findOneBy({ email: username });

    const result = await this.httpBdmProvider.fetchData({
      url: `/v25/history/app/${data}/all?after=0&limit=${limit}`,
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'payload':`payload: custom:id:${user.userBdmId}]`
       },
    })

    return this.mappedData(result)
  }
  

  private mappedData(data: any) {
    return data.map((item: any) => {
      const transactionsAmount = item.amount;
      const movimentationType = transactionsAmount > 0 ? 'entrada' : 'saida';
      return {
        id: item.id,
        data: item.timestamp,
        movimentationType: movimentationType,
        sender: item.sender,
        receiver: item.recipient,
        transactionAmount: transactionsAmount,
        totalTransactionAmount: transactionsAmount + item.fee,
      };
    });
  }
}