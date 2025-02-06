export interface IDeleteUserUseCase {
  execute(id: string): Promise<void>;
}

export const IDeleteUserUseCase = Symbol('IDeleteUserUseCase');
