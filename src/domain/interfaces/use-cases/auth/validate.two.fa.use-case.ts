
export interface IVaidateTwoFaUseCase {
  execute(username: string, twofa: number): Promise<any>;
}

export const IVaidateTwoFaUseCase = Symbol('IVaidateTwoFaUseCase');
