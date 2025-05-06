import { ConsolidateTransactionsDto } from "@/modules/transactions/api/dtos/consolidate-transactions.dto";

export interface IGetConsolidateTransactionsByWalletIdUseCase {
  execute(data: ConsolidateTransactionsDto): Promise<any>;
}

export const IGetConsolidateTransactionsByWalletIdUseCase = Symbol('IGetConsolidateTransactionsByWalletIdUseCase');
