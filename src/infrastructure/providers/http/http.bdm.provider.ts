import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

@Injectable()
export class HttpBdmProvider {
  private httpClient: AxiosInstance;

  constructor(private readonly logger: Logger) {
    this.logger = new Logger(HttpBdmProvider.name);

    this.httpClient = axios.create({
      baseURL: `${process.env.BASE_URL_BDM}/${process.env.BDM_VERSION}`,
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
      console.log(config.baseURL);
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
}
