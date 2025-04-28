import { ITransactionsDto } from "../../dto/transactions/transactions.dto";

export interface IGetTransactionsByWalletIdUseCase {
  execute(data: ITransactionsDto): Promise<any>;
}

export const IGetTransactionsByWalletIdUseCase = Symbol('IGetTransactionsByWalletIdUseCase');
