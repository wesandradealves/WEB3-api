import { TransferStatusEnum } from "@/domain/enums/transfer.status.enum";

export interface IGetListAvailableTransferUseCase{
  execute(email: string, status?: TransferStatusEnum): Promise<any>;
}

export const IGetListAvailableTransferUseCase = Symbol('IGetListAvailableTransferUseCase');
