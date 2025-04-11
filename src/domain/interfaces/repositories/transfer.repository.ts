import { TransferStatusEnum } from "@/domain/enums/transfer.status.enum";

export interface ITransferAssetRepository {
  transfer(file: any, user: any): Promise<any>;
  processTransfer(body: any): Promise<any>;
  getListAvailableTransfers(email: string, status: TransferStatusEnum): Promise<any>;
}

export const ITransferAssetRepository = Symbol('ITransferAssetRepository');