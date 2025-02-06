import { ISESProvider } from '@/domain/interfaces/providers/ses.provider';
import { SESClient } from '@aws-sdk/client-ses';
import { Module } from '@nestjs/common';
import { SESProvider } from './ses.provider';

@Module({
  imports: [],
  providers: [
    {
      provide: ISESProvider,
      useFactory: async () => {
        const sesClient = new SESClient({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          },
        });
        return new SESProvider(sesClient);
      },
    },
  ],
  exports: [ISESProvider],
})
export class SESModule {}
