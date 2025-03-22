export interface ISendCsvToTransferUseCase {
   execute(data: any, userId: string): Promise<any>;
}

export const ISendCsvToTransferUseCase = Symbol('ISendCsvToTransferUseCase');
