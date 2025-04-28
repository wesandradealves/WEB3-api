import { UserEntity } from '@/domain/entities/user.entity';
import { IExtractExternal } from '@/domain/interfaces/external/extract.external';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import { ExtractResponseDto } from '@/modules/extract/api/dto/extract.reponse.dto';
import { ExtractRequestDto } from '@/modules/extract/api/dto/extract.request.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpBdmProvider } from '../providers/http/http.bdm.provider';

@Injectable()
export class ExtractExternal implements IExtractExternal {
  private readonly bdmUsername: string;
  private readonly bdmPassword: string;
  constructor(
    @Inject(ICognitoProvider)
    private readonly cognito: ICognitoProvider,
    @InjectRepository(UserEntity)
    private readonly userEntity: Repository<UserEntity>,
    @Inject(HttpBdmProvider)
    private readonly httpBdmProvider: HttpBdmProvider,
    private readonly configService: ConfigService,
  ) {
    this.bdmUsername = this.configService.get<string>('bdm.username');
    this.bdmPassword = this.configService.get<string>('bdm.password');
  }
  async getExtractByWalletId(query: ExtractRequestDto): Promise<ExtractResponseDto> {
    const user = await this.userEntity.findOneBy({ email: query.username });

    const { AuthenticationResult } = await this.cognito.signIn({
      username: this.bdmUsername,
      password: this.bdmPassword,
    });

    const result = await this.httpBdmProvider.fetchData({
      url: `/history/app/${query.walletId}/all?after=0&limit=${query.limit}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthenticationResult.AccessToken}`,
        payload: `payload: custom:id:${user.userBdmId}]`,
      },
    });

    return this.mappedData(result);
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
