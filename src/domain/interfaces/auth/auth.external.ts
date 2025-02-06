export interface ISignInRequest {
  username: string;
  password: string;
}

export interface ISignInResponse {
  auth: boolean;
  expires: number;
  tokenJwt: string;
  refreshToken: string;
}

export interface IAuthExetrnal {
  signIn(data: ISignInRequest): Promise<ISignInResponse>;
}

export const IAuthExetrnal = Symbol('IAuthExetrnal');
