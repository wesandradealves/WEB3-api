import { UserEntity } from '@/domain/entities/user.entity';
import { ITransactionsExternal } from '@/domain/interfaces/external/transactions.external';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import { TransactionsDto } from '@/modules/transactions/api/dtos/transactions.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpBdmProvider } from '../providers/http/bdm/http.bdm.provider';
import { ConsolidateTransactionsDto } from '@/modules/transactions/api/dtos/consolidate-transactions.dto';

@Injectable()
export class TransactionsExternal implements ITransactionsExternal {
  private readonly bdmUsername: string;
  private readonly bdmPassword: string;
  constructor(
    @Inject(ICognitoProvider)
    private readonly cognito: ICognitoProvider,
    @InjectRepository(UserEntity)
    private readonly user: Repository<UserEntity>,
    @Inject(HttpBdmProvider)
    private readonly httpBdmProvider: HttpBdmProvider,
    private readonly configService: ConfigService,
  ) {
    this.bdmUsername = this.configService.get<string>('bdm.username');
    this.bdmPassword = this.configService.get<string>('bdm.password');
  }

  async getTransactionsByWalletId(data: TransactionsDto): Promise<any> {
    let user = await this.user.findOneBy({ email: data.username });

    const { AuthenticationResult } = await this.cognito.signIn({
      username: this.bdmUsername,
      password: this.bdmPassword,
    });

    const result = await this.httpBdmProvider.fetchData({
      url: `/history/transactions-by-wallet/${data.walletId}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${AuthenticationResult.AccessToken}`,
        'Content-Type': 'application/json',
        payload: `payload: custom:id:${user.userBdmId}]`,
      },
    });

    return result;
  }


  async getConsolidateTransactionsByWalletId(data: ConsolidateTransactionsDto): Promise<any> {
    let user = await this.user.findOneBy({ email: data.username });

    const { AuthenticationResult } = await this.cognito.signIn({
      username: this.bdmUsername,
      password: this.bdmPassword,
    });

    const result = await this.httpBdmProvider.fetchData({
      url: `history/app/${data.walletId}/${data.type}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${AuthenticationResult.AccessToken}`,
        'Content-Type': 'application/json',
        payload: `payload: custom:id:${user.userBdmId}]`,
      },
      params: {
        limit: data.limit || 10,
        after: data.after || 0,
      },
    });

    return result;
  }
}