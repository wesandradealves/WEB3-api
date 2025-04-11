export interface IQuotationExternal {
  getQuotations(userBdmId: number): Promise<any>;
  getQuoteInformation(userBdmId: number, asset: string): Promise<any>;
}

export const IQuotationExternal = Symbol('IQuotationExternal');
