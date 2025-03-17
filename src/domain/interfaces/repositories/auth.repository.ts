export interface ISignInOperatorRequest {
  username: string;
  password: string;
}

export interface ISignInOperatorResponse {
  auth: boolean;
  expires: number;
  tokenJwt: string;
}

export interface IAuthRepository {
  signInRefresh(data: ISignInOperatorRequest, token: string): Promise<any>;
  storeAfterSignIn(data: any): Promise<any>;
  validate(id: string): Promise<any>;
  signInSendTwoFa(data: ISignInOperatorRequest): Promise<ISignInOperatorResponse>;
  validateTwoFa(userId: string, twoFa: number): Promise<ISignInOperatorResponse>; 
}



export const IAuthRepository = Symbol('IAuthRepository');
