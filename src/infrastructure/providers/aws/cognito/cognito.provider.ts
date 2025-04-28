import { ISignInRequest } from '@/domain/interfaces/auth/auth.external';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import {
  BdmIdToken,
  SignInBdmFullResponseResult,
} from '@/domain/types/cognito/cognito.type';
import {
  AuthFlowType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class CognitoProvider implements ICognitoProvider {
  private readonly cognito: CognitoIdentityProviderClient;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly bdmUsername: string;
  private readonly bdmPassword: string;

  constructor(private readonly configService: ConfigService) {
    this.cognito = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.clientId = process.env.AWS_COGNITO_CLIENT_ID;
    this.clientSecret = process.env.AWS_COGNITO_CLIENT_ID_SECRET;
    this.bdmUsername = this.configService.get<string>('bdm.username');
    this.bdmPassword = this.configService.get<string>('bdm.password');
  }

  async signInBdmFullResponse(): Promise<SignInBdmFullResponseResult> {
    try {
      Logger.log('Sign in BDM Cognito', 'signInBdmFullResponse');
      const cognitoResponse = await this.signIn({
        username: this.bdmUsername,
        password: this.bdmPassword,
      });
      const idTokenInfo = jwt.decode(
        cognitoResponse.AuthenticationResult.IdToken,
      ) as BdmIdToken;

      Logger.debug(
        `idTokenInfo \n${JSON.stringify(idTokenInfo)}`,
        'signInBdmFullResponse',
      );
      return {
        ...idTokenInfo,
        AccessToken: cognitoResponse.AuthenticationResult.AccessToken,
      };
    } catch (error) {
      Logger.error(error, error.stack, 'signInBdmFullResponse');
      throw error;
    }
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
