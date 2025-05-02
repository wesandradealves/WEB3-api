import {
  IBdmExternal,
  IViewBdmUserData,
  IViewCurrency,
  IViewWallet,
} from '@/domain/interfaces/external/bdm.external';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import { Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpBdmProvider } from '../providers/http/bdm/http.bdm.provider';

export class BdmExternal implements IBdmExternal {
  private readonly bdmApiKey: string;
  private tokenJwt: string;
  constructor(
    @Inject(ICognitoProvider)
    private readonly cognito: ICognitoProvider,
    private readonly httpBdmClient: HttpBdmProvider,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(BdmExternal.name);
    this.bdmApiKey = this.configService.getOrThrow('bdm.apiKey');
  }

  async findDefaultWalletByUserId(userId: number): Promise<IViewWallet> {
    this.logger.log('Buscando wallet BDM');
    try {
      this.tokenJwt = await this.cognito.signInBdm();

      const response = await this.httpBdmClient.fetchData({
        url: `/wallets`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'bdm-api-key': this.bdmApiKey,
          Authorization: `Bearer ${this.tokenJwt}`,
          payload: `custom:id:${userId}]`,
        },
      });

      if (Array.isArray(response)) {
        const defaultWallet = response.find((wallet) => wallet.isDefault === true);
        if (defaultWallet) {
          return defaultWallet;
        }
        return response[0];
      }

      return response;
    } catch (error) {
      this.logger.error(`Erro ao buscar wallet do BDM`);
      this.logger.error(error.message);
      throw error;
    }
  }

  async getCurrencies(): Promise<IViewCurrency[]> {
    this.logger.log('Buscando currencies BDM');
    try {
      this.tokenJwt = await this.cognito.signInBdm();
      const response = await this.httpBdmClient.fetchData({
        url: `/currencies`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.tokenJwt}`,
        },
      });

      return response;
    } catch (error) {
      this.logger.error(`Erro ao buscar currencies do BDM`);
      this.logger.error(error.message);
      throw error;
    }
  }
  async getBdmUserData(userId: string): Promise<IViewBdmUserData> {
    this.logger.log('Buscando dados do usuário BDM');
    try {
      this.tokenJwt = await this.cognito.signInBdm();
      const response = await this.httpBdmClient.fetchData({
        url: `/users/info`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.tokenJwt}`,
          payload: `custom:id:${userId}]`,
        },
      });

      return response;
    } catch (error) {
      this.logger.error(`Erro ao buscar currencies do BDM`);
      this.logger.error(error.message);
      throw error;
    }
  }

  async getBdmUserDataByEmail(email: string): Promise<IViewBdmUserData> {
    const attachment = `${email}:`;
    Logger.log(
      `${attachment}Buscando dados do usuário BDM pelo email`,
      'getBdmUserDataByEmail',
    );
    try {
      const cognitoResponse = await this.cognito.signInBdmFullResponse();
      const response = await this.httpBdmClient.fetchData({
        url: `/users/by-email/${email}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cognitoResponse.AccessToken}`,
          payload: `custom:id:${cognitoResponse['custom:id']}]`,
        },
      });

      return response;
    } catch (error) {
      Logger.error(attachment + error.message, error.stack, 'getBdmUserDataByEmail');
      error.message = 'Erro ao buscar dados do usuário BDM pelo email:' + error.message;
      throw error;
    }
  }
  async getBdmUserDataByWalletId(walletId: string): Promise<IViewBdmUserData> {
    const attachment = `${walletId}:`;
    Logger.log(
      `${attachment}Buscando dados do usuário BDM pelo walletId`,
      'getBdmUserDataByWalletId',
    );
    try {
      const cognitoResponse = await this.cognito.signInBdmFullResponse();
      const response = await this.httpBdmClient.fetchData({
        url: `/users/by-wallet/${walletId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cognitoResponse.AccessToken}`,
          payload: `custom:id:${cognitoResponse['custom:id']}]`,
        },
      });

      return response;
    } catch (error: any) {
      Logger.error(attachment + error.response, error.stack, 'getBdmUserDataByWalletId');
      error.message =
        'Erro ao buscar dados do usuário BDM pelo identificador da carteira - ' +
        error.message;
      throw error;
    }
  }

  async getDefaultWalletByEmail(email: string): Promise<IViewBdmUserData> {
    const attachment = `${email}:`;
    Logger.log(
      `${attachment}Buscando dados do usuário BDM pelo email`,
      'getBdmUserDataByEmail',
    );
    try {
      const cognitoResponse = await this.cognito.signInBdmFullResponse();
      const response = await this.httpBdmClient.fetchData({
        url: `/Users/default-wallet/${email}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cognitoResponse.AccessToken}`,
          payload: `custom:id:${cognitoResponse['custom:id']}]`,
        },
      });

      return response;
    } catch (error) {
      Logger.error(attachment + error.message, error.stack, 'getBdbDefaultWalletByEmail');
      error.message = 'Erro ao buscar a carteira padrão do usuario:' + error.message;
      throw error;
    }
  }

  async findWalletById(walletId: number): Promise<IViewWallet> {
    this.logger.log('Buscando wallet BDM');
    try {
      const cognitoResponse = await this.cognito.signInBdmFullResponse();

      this.logger.debug(
        `Token JWT obtained: ${cognitoResponse.AccessToken.substring(0, 20)}...`,
      );

      const response = await this.httpBdmClient.fetchData({
        url: `/wallets/pos/${walletId}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'bdm-api-key': this.bdmApiKey,
          Authorization: `Bearer ${cognitoResponse.AccessToken}`,
          payload: `custom:id:${cognitoResponse['custom:id']}]`,
        },
      });

      return response;
    } catch (error) {
      this.logger.error(`Erro ao buscar wallet do BDM`);
      this.logger.error(error.message);
      throw error;
    }
  }

  async transferAsset(body: any): Promise<IViewWallet> {
    this.logger.log('Transferindo assets no BDM');
    try {
      const cognitoResponse = await this.cognito.signInBdmFullResponse();

      this.logger.debug(
        `Token JWT obtained: ${cognitoResponse.AccessToken.substring(0, 20)}...`,
      );
      this.logger.debug(`Request body: ${JSON.stringify(body)}`);

      const response = await this.httpBdmClient.fetchData({
        url: `operations/BDM/transfer`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bdm-api-key': this.bdmApiKey,
          Authorization: `Bearer ${cognitoResponse.AccessToken}`,
          payload: `custom:id:${cognitoResponse['custom:id']}]`,
        },
        data: body,
      });

      return response;
    } catch (error) {
      this.logger.error(`Erro ao transferir assets: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }
}
