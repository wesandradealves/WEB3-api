import {
  IAuthExetrnal,
  ISignInRequest,
  ISignInResponse,
} from '@/domain/interfaces/auth/auth.external';
import { Injectable, Logger } from '@nestjs/common';
import { HttpBdmProvider } from '../providers/http/bdm/http.bdm.provider';

@Injectable()
export class AuthExternal implements IAuthExetrnal {
  constructor(
    private readonly httpClient: HttpBdmProvider,
    private readonly logger: Logger,
  ) {
    this.logger = new Logger(AuthExternal.name);
  }

  async signIn(data: ISignInRequest): Promise<ISignInResponse> {
    this.logger.log('Exemplo de uso de api externa');
    return await this.httpClient.fetchData({
      url: '/bdm',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      data,
    });
  }
}
