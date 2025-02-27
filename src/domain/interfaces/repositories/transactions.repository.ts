export interface ItransactionsRepository {
  getTransactionsByWalletId(walletId: number, username: string): Promise<any>;
}


export const ItransactionsRepository = Symbol('ItransactionsRepository');
