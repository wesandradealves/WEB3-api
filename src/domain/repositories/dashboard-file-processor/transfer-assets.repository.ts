export interface ITransferAssetRepository {
  transferAssets(body: any): Promise<any>;
}

export const ITransferAssetRepository = Symbol('ITransferAssetRepository');
