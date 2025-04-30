import { SQSMessage } from "../../functions/process.transfer.interface";

export interface ITransferAssetUseCase{
  execute(content: SQSMessage): Promise<any>;
}


export const ITransferAssetUseCase = Symbol('ITransferAssetUseCase');