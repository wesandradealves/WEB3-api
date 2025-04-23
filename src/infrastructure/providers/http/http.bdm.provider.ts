import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

@Injectable()
export class HttpBdmProvider {
  private httpClient: AxiosInstance;
  private username: string;
  private password: string;

  constructor(
    @Inject(ICognitoProvider)
    private readonly cognitoProvider: ICognitoProvider,
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(HttpBdmProvider.name);

    this.username = this.configService.get('bdm.username');
    this.password = this.configService.get('bdm.password');

    this.httpClient = axios.create({
      baseURL: `${this.configService.get('bdm.url')}/${this.configService.get('bdm.version')}`,
      timeout: +process.env.HTTP_TIMEOUT | 30000,
    });

    this.httpClient.interceptors.request.use(function (config) {
      config['metadata'] = { ...config['metadata'], startDate: new Date() };
      return config;
    });
    this.httpClient.interceptors.response.use(
      (response) => {
        const { config } = response;
        config['metadata'] = { ...config['metadata'], endDate: new Date() };
        const duration =
          config['metadata'].endDate.getTime() - config['metadata'].startDate.getTime();
        this.logger.log(`${config.method.toUpperCase()} ${config.url} ${duration}ms`);
        return response;
      },
      (err) => {
        this.logger.error(err);
        return Promise.reject(err);
      },
    );
  }

  async fetchData<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      // Autenticação no cognito antes de realizar a requisição
      await this.authenticate();

      const response: AxiosResponse<T> = await this.httpClient.request<T>(config);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError;
        if (err.response) {
          this.logger.log(
            `Erro HTTP: ${err.response.status} - ${err.response.statusText} - ${JSON.stringify(err.response.data)}`,
          );

          throw new HttpException(undefined, err.response.status);
        }
        this.logger.error('Erro no processo principal.');
      }
      this.logger.error('Erro ao buscar dados.');
      throw new InternalServerErrorException();
    }
  }

  private async authenticate(): Promise<void> {
    try {
      const token = await this.getAuthToken();
      this.httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      this.logger.error('Erro ao autenticar.', error);
      throw new InternalServerErrorException('Falha na autenticação com a bdm.');
    }
  }

  private async getAuthToken(): Promise<Record<string, any>> {
    const { AuthenticationResult } = await this.cognitoProvider.signIn({
      username: this.username,
      password: this.password,
    });

    return AuthenticationResult.AccessToken;
  }
}
