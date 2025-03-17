import { ITransactionsDto } from "../dto/transactions/transactions.dto";

export interface ItransactionsRepository {
  getTransactionsByWalletId(data: ITransactionsDto): Promise<any>;
}


export const ItransactionsRepository = Symbol('ItransactionsRepository');
