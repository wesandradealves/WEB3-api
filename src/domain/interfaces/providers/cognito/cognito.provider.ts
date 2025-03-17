import { ISignInRequest } from '../../auth/auth.external';

export interface ICognitoProvider {
  signIn(data: ISignInRequest): Promise<any>;
}

export const ICognitoProvider = Symbol('ICognitoProvider');
