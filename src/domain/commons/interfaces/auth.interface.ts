export interface ISignInRequest {
  username: string;
  password: string;
}

export interface ISignInResponse {
  auth: boolean;
  expires: number;
  tokenJwt: string;
}
