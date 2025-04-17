import {
  IBdmExternal,
  IViewBdmUserData,
} from '@/domain/interfaces/external/bdm.external';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito.provider';
import { Inject, Logger } from '@nestjs/common';
import { HttpBdmProvider } from '../providers/http/http.bdm.provider';

export class BdmExternal implements IBdmExternal {
  constructor(
    @Inject(ICognitoProvider)
    private readonly cognito: ICognitoProvider,
    private readonly httpBdmClient: HttpBdmProvider,
  ) {}

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
}
