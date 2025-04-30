import { TransferStatusEnum } from "@/domain/commons/enum/transfer.status.enum";

export interface IGetAvailableTransferUseCase{
  execute(email: string, status?: TransferStatusEnum): Promise<any>;
}

export const IGetAvailableTransferUseCase = Symbol('IGetAvailableTransferUseCase');
