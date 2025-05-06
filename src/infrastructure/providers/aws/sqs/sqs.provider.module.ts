import { ISQSProvider } from '@/domain/interfaces/providers/sqs.provider';
import { SqsProvider } from './sqs.provider';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [
    { provide: ISQSProvider, useClass: SqsProvider }
  ],
  exports: [ISQSProvider],
})
export class SqsProviderModule {}
