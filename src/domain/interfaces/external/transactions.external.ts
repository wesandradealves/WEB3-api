import { ITransactionsDto } from '../dto/transactions/transactions.dto';

export interface ITransactionsExternal {
  getTransactionsByWalletId(data: ITransactionsDto): Promise<any>;
  getConsolidateTransactionsByWalletId(data: ITransactionsDto): Promise<any>;
}

export const ITransactionsExternal = Symbol('ITransactionsExternal');
