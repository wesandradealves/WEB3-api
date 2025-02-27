
export interface IGetTransactionsByWalletIdUseCase {
  execute(walletId: number, username:string): Promise<any>;
}

export const IGetTransactionsByWalletIdUseCase = Symbol('IGetTransactionsByWalletIdUseCase');
