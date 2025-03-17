export interface IExtractRepository {
  getExtractByWalletId(walletId: number, username: string, limit: number): Promise<any>;
}


export const IExtractRepository = Symbol('IExtractRepository');
