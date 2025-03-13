export interface IValidateTwoFaUseCase {
  execute(username: string, twofa: number): Promise<any>;
}

export const IValidateTwoFaUseCase = Symbol('IValidateTwoFaUseCase');
