export interface ITransferUseCase{
  execute(content: any, user: any): Promise<any>;
}


export const ITransferUseCase = Symbol('ITransferUseCase');