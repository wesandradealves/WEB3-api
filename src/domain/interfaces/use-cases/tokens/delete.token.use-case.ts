export interface IDeleteTokenUseCase {
  execute(id: string): Promise<void>;
}

export const IDeleteTokenUseCase = Symbol('IDeleteTokenUseCase');
