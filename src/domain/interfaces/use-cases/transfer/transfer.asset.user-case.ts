export interface ITransferAssetUseCase{
  execute(content: any): Promise<any>;
}


export const ITransferAssetUseCase = Symbol('ITransferAssetUseCase');