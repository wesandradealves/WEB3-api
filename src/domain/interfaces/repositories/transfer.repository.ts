import { TransferStatusEnum } from "@/domain/commons/enum/transfer.status.enum";

export interface ISenderTransferData{
  senderEmail: string;
  senderWalletAddress: string;
  senderWalletId: number;
}
export interface ITransferAssetRepository {
  transfer(file: any, user: ISenderTransferData): Promise<any>;
  processTransfer(body: any): Promise<any>;
  getListAvailableTransfers(email: string, status: TransferStatusEnum): Promise<any>;
}




export const ITransferAssetRepository = Symbol('ITransferAssetRepository');