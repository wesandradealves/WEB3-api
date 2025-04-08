export interface ITransferAssetRepository {
  transfer(file: any, user: any): Promise<any>;
  processTransfer(body: any): Promise<any>;
}

export const ITransferAssetRepository = Symbol('ITransferAssetRepository');