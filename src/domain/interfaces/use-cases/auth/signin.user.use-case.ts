import { ISignInRequest, ISignInResponse } from '../../auth/auth.external';

export interface ISignInUseCase {
  execute(data: ISignInRequest): Promise<ISignInResponse>;
}

export const ISignInUseCase = Symbol('ISignInUseCase');
