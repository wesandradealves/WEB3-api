import { SignInBdmFullResponseResult } from '@/domain/types/cognito/cognito.type';

export interface ICognitoProvider {
  signInBdmFullResponse(): Promise<SignInBdmFullResponseResult>;
}

export const ICognitoProvider = Symbol('ICognitoProvider');
