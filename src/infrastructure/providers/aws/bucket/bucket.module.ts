import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IBucketProvider } from '@/domain/interfaces/providers/bucket.provider';
import { BucketProvider } from './bucket.provider';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    Logger,
    {
      provide: IBucketProvider,
      useClass: BucketProvider,
    },
  ],
  exports: [ICognitoProvider],
})
export class BucketModule {}
