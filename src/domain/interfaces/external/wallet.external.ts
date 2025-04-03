export interface IWalletRepository {
  getUserWallets(userBdmId: number): Promise<any>;
}
  
export const IWalletRepository = Symbol('IWalletRepository');
  