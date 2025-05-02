import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpBlockchainProvider {
  private readonly httpClient: AxiosInstance;
  private readonly blockChainUrl: string;
  private readonly blockChainApiKeyHash: string;

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.blockChainUrl = this.configService.get('blockChain.blockChainApiUrl');
    this.blockChainApiKeyHash = this.configService.get('blockChain.blockChainApiKeyHash');
    this.logger = new Logger(HttpBlockchainProvider.name);

    this.httpClient = axios.create({
      baseURL: `${this.blockChainUrl}`,
      timeout: +(process.env.HTTP_TIMEOUT as any) || 30000,
      headers: {
        'X-API-Key': this.blockChainApiKeyHash,
      },
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

  async request<T = any>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.httpClient.request<T>(config);
      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
