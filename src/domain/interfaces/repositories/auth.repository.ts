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
  signIn(data: ISignInOperatorRequest): Promise<ISignInOperatorResponse>;
  signOut(data: any): Promise<any>;
  findUser(data: any): Promise<any>;
  signInRefresh(data: ISignInOperatorRequest, token: string): Promise<any>;
  storeAfterSignIn(data: any): Promise<any>;
  validate(id: string): Promise<any>;
}



export const IAuthRepository = Symbol('IAuthRepository');
