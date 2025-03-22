import { Logger, Module } from '@nestjs/common';
import { TransferController } from './api/controller/transfer.controller';
import { IBucketProvider } from '@/domain/interfaces/providers/bucket.provider';
import { BucketProvider } from '@/infrastructure/providers/aws/bucket/bucket.provider';
import { ISendCsvToTransferUseCase } from '@/domain/interfaces/use-cases/transfer/send-csv-to-transfer.use-case';
import { SendCsvToTransferUseCase } from './use-cases/send-csv-to-transfer.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateFiles } from '@/domain/entities/update-files.entity';

@Module({
  imports: [
     TypeOrmModule.forFeature([UpdateFiles]),
  ],
  controllers: [TransferController],
  providers: [
      Logger,
        {
          provide: IBucketProvider,
          useClass: BucketProvider,
        },
        {
          provide: ISendCsvToTransferUseCase,
          useClass: SendCsvToTransferUseCase,
        }
      ],
  exports: [],
})
export class TransferModule {}