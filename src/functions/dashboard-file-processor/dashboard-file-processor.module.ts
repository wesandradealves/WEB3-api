import { DashboardTransferList } from "@/domain/entities/transfer.assets.entity";
import { UploadedFiles } from "@/domain/entities/uploaded.files.entity";
import { IBucketProvider } from "@/domain/interfaces/providers/bucket.provider";
import { IDashboardFileProcessorRepository } from "@/domain/repositories/dashboard-file-processor/dashboard-file.processor.repository";
import AppEnvs from "@/infrastructure/config/app.config";
import { DataBaseModule } from "@/infrastructure/database/database.module";
import { S3External } from "@/infrastructure/external/s3.external";
import { BucketProvider } from "@/infrastructure/providers/aws/bucket/bucket.provider";
import { DashboardFileProcessor } from "@/infrastructure/repositories/dashboard-transfer-process/dashboard-file-processor.repository";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [AppEnvs]}),
    DataBaseModule, 
    TypeOrmModule.forFeature([UploadedFiles, DashboardTransferList]),
  ],   

  providers: [
    S3External,
    {
      provide: IDashboardFileProcessorRepository,
      useClass: DashboardFileProcessor,
    },
    {
      provide: IBucketProvider,
      useClass: BucketProvider
      ,
    }
  ],
})
export class DashboardFileProcessorModule {}
