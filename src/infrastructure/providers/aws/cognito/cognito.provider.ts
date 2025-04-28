import { ISignInRequest } from '@/domain/interfaces/auth/auth.external';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CognitoProvider implements ICognitoProvider {
  private readonly cognito: CognitoIdentityProviderClient;
  private readonly clientId: string;
  private readonly clientSecret: string;
  constructor() {
    this.cognito = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.clientId = process.env.AWS_COGNITO_CLIENT_ID;
    this.clientSecret = process.env.AWS_COGNITO_CLIENT_ID_SECRET;
  }

  async signIn(data: ISignInRequest): Promise<any> {
    const secretHash = await this.calculateSecretHash(data.username);

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      AuthParameters: {
        USERNAME: data.username,
        PASSWORD: data.password,
        SECRET_HASH: secretHash,
      },
      ClientId: process.env.AWS_COGNITO_CLIENT_ID,
    });

    return await this.cognito.send(command);
  }

  private async calculateSecretHash(username: string) {
    const hmac = crypto.createHmac('sha256', this.clientSecret);
    hmac.update(`${username}${this.clientId}`);
    return hmac.digest('base64');
  }
}
