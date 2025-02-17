import { ISignInRequest } from "../../auth/auth.external";


export interface ICognitoProvider {
  signIn(data: ISignInRequest): Promise<any>;
  signInBdm(): Promise<string>;
}

export const ICognitoProvider = Symbol('ICognitoProvider');
