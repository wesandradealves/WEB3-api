import { SignInBdmFullResponseResult } from '@/domain/types/cognito/cognito.type';
import { ISignInRequest } from '../../auth/auth.external';

export interface ICognitoProvider {
  signIn(data: ISignInRequest): Promise<any>;
  signInBdmFullResponse(): Promise<SignInBdmFullResponseResult>;
}

export const ICognitoProvider = Symbol('ICognitoProvider');
