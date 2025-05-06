import { ITransactionsExternal } from '@/domain/interfaces/external/transactions.external';
import { Inject, Injectable } from '@nestjs/common';
import { IGetConsolidateTransactionsByWalletIdUseCase } from '@/domain/interfaces/use-cases/transactions/get.consolidate.transactions.by.wallet.id.use-case';
import { ConsolidateTransactionsDto } from '../api/dtos/consolidate-transactions.dto';

@Injectable()
export class GetConsolidateTransactionsByWalletIdUseCase
  implements IGetConsolidateTransactionsByWalletIdUseCase
{
  constructor(
    @Inject(ITransactionsExternal)
    private readonly transactionsRepository: ITransactionsExternal,
  ) {}

  async execute(data: ConsolidateTransactionsDto): Promise<any> {
    return await this.transactionsRepository.getConsolidateTransactionsByWalletId(data);
  }
}
