

export interface IViewWallet {
  id: number;
  name: string;
  address: string;
  imported: boolean;
  isDefault: boolean;
  sellTax: string;
  type: string;
  publicKey: string;
  secretKey: string;
  user_id: number;
}

export interface IViewCurrency {
  id: number;
  asset_id: string;
  asset: string;
  description: string;
  floating_point: number;
  operations: string[];
  has_quotation: boolean;
  fiduciary: boolean;
  updated: boolean;
  created_at: string;
  updated_at: string;
}

export type IViewBdmUserData = {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
}

export class BalanceResponse {
  balance: number;
  asset: string;
  symbol: string;
  floating_point: number;
}

export interface IBdmExternal {
  findDefaultWalletByUserId(walletId: number): Promise<IViewWallet>;
  getCurrencies(): Promise<IViewCurrency[]>;
  getBdmUserData(id: any): Promise<IViewBdmUserData>;
  getBdmUserDataByEmail(email: string): Promise<IViewBdmUserData>;
  getBdmUserDataByWalletId(walletId: string): Promise<IViewBdmUserData>;
  findWalletById(walletId: number): Promise<IViewWallet>;
  transferAsset(body: any): Promise<any>;
}

export const IBdmExternal = Symbol('IBdmExternal');
