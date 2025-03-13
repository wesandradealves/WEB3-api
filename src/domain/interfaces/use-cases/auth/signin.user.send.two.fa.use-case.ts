import { ISignInRequest, ISignInResponse } from '../../auth/auth.external';

export interface ISignInUserSendTwoFaUseCase {
  execute(data: ISignInRequest): Promise<ISignInResponse>;
}

export const ISignInUserSendTwoFaUseCase = Symbol('ISignInUserSendTwoFaUseCase');
