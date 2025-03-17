import { ISignInRequest, ISignInResponse } from '../../auth/auth.external';

export interface ISignInRefreshTokenUseCase {
  execute(data: ISignInRequest, token: string): Promise<ISignInResponse>;
}

export const ISignInRefreshTokenUseCase = Symbol('ISignInRefreshTokenUseCase');
