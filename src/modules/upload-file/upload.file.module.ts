import { Logger, Module } from '@nestjs/common';
import { UploadController } from './api/controller/upload.controller';
import { IBucketProvider } from '@/domain/interfaces/providers/bucket.provider';
import { BucketProvider } from '@/infrastructure/providers/aws/bucket/bucket.provider';
import { ISendCsvUseCase } from '@/domain/interfaces/use-cases/update-file/send.csv.use-case';
import { SendCsvUseCase } from './use-cases/send.csv.use-case';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateFiles } from '@/domain/entities/update-files.entity';

@Module({
  imports: [
     TypeOrmModule.forFeature([UpdateFiles]),
  ],
  controllers: [UploadController],
  providers: [
      Logger,
        {
          provide: IBucketProvider,
          useClass: BucketProvider,
        },
        {
          provide: ISendCsvUseCase,
          useClass: SendCsvUseCase,
        },
      ],
      
  exports: [],
})
export class UploadFileModule {}