import { ITransactionsExternal } from '@/domain/interfaces/external/transactions.external';
import { IGetTransactionsByWalletIdUseCase } from '@/domain/interfaces/use-cases/transactions/get.transactions.by.wallet.id.use-case';
import { Inject, Injectable } from '@nestjs/common';
import { TransactionsDto } from '../api/dtos/transactions.dto';

@Injectable()
export class GetTransactionsByWalletIdUseCase
  implements IGetTransactionsByWalletIdUseCase
{
  constructor(
    @Inject(ITransactionsExternal)
    private readonly transactionsRepository: ITransactionsExternal,
  ) {}

  async execute(data: TransactionsDto): Promise<any> {
    return await this.transactionsRepository.getTransactionsByWalletId(data);
  }
}
