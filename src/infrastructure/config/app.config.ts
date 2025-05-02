import * as dotenv from 'dotenv';

dotenv.config();

const AppEnvs = () => ({
  isDevelopment: process.env.ENVIRONMENT === 'production',
  application: {
    serviceName: 'dourado-dashboard-backend',
    port: process.env.HTTP_PORT,
  },
  database: {
    dashboard: {
      type: process.env.DATABASE_TYPE,
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      port: +process.env.DATABASE_PORT,
      logging: false,
      synchronize: true,
      entities: [`${__dirname}/../**/*.entity.{js,ts}`],
    },
  },
  auth: {
    tokenJwt: {
      secret: process.env.TOKEN_JWT_SECRET,
      signOptions: {
        expiresIn: `${process.env.TOKEN_JWT_EXPIRES}s`,
      },
    },
  },
  bdm: {
    version: process.env.BDM_VERSION,
    url: process.env.BASE_URL_BDM,
    username: process.env.BDM_AUTH_USERNAME,
    password: process.env.BDM_AUTH_PASSWORD,
    apiKey: process.env.BDM_API_KEY,
  },
  transfer: {
    asset: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
  },
  blockChain: {
    blockChainApiUrl: process.env.BLOCKCHAIN_API_URL,
    blockChainApiKey: process.env.BLOCKCHAIN_API_KEY,
  },
});

export type AppEnvsType = ReturnType<typeof AppEnvs>;
export default AppEnvs;
