export interface ISendCsvUseCase {
   execute(data: any, userId: string): Promise<any>;
}

export const ISendCsvUseCase = Symbol('ISendCsvUseCase');
