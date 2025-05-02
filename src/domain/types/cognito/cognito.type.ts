export interface BdmIdToken {
  sub: string;
  iss: string;
  'custom:id': string;
  'cognito:username': string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  'custom:status': string;
  name: string;
  phone_number: string;
  exp: number;
  iat: number;
  jti: string;
  email: string;
}

export interface SignInBdmFullResponseResult extends BdmIdToken {
  AccessToken: string;
}
