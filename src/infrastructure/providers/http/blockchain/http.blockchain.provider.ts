import { BlockchainEnum } from '@/domain/commons/enum/blockchain.enum';
import {
  Injectable,
  Logger,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

@Injectable()
export class HttpBlockchainProvider {
  private readonly httpClient: AxiosInstance;
  private readonly BLOCKCHAIN_API_URL: string = '';
  private readonly BLOCKCHAIN_API_KEY_HASH: string = '';

  constructor(
    private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {
    this.BLOCKCHAIN_API_URL =
      this.configService.get(BlockchainEnum.BLOCKCHAIN_API_URL) ?? '';
    this.BLOCKCHAIN_API_KEY_HASH =
      this.configService.get(BlockchainEnum.BLOCKCHAIN_API_KEY_HASH) ?? '';
      
    if (!this.BLOCKCHAIN_API_URL || !this.BLOCKCHAIN_API_KEY_HASH) {
      const errorMessage = `Required environment parameters to work -> [BLOCKCHAIN_API_URL, BLOCKCHAIN_API_KEY_HASH]`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    this.logger = new Logger(HttpBlockchainProvider.name);

    this.httpClient = axios.create({
      baseURL: `${this.BLOCKCHAIN_API_URL}`,
      timeout: +(process.env.HTTP_TIMEOUT as any) || 30000,
      headers: {
        'X-API-Key': this.BLOCKCHAIN_API_KEY_HASH,
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
