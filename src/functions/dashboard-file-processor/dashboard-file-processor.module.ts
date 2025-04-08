import { DashboardTransferList } from "@/domain/entities/dashboard-transfer-list.entity";
import { UpdateFiles } from "@/domain/entities/update-files.entity";
import { IDashboardFileProcessorRepository } from "@/domain/repositories/dashboard-file-processor/dashboard-file.processor.repository";
import { DataBaseModule } from "@/infrastructure/database/database.module";
import { S3External } from "@/infrastructure/external/s3.external";
import { DashboardFileProcessor } from "@/infrastructure/repositories/dashboard-transfer-process/dashboard-file-processor.repository";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
  imports: [
    DataBaseModule, 
    TypeOrmModule.forFeature([UpdateFiles, DashboardTransferList]),
  ],   

  providers: [
    S3External,
    {
      provide: IDashboardFileProcessorRepository,
      useClass: DashboardFileProcessor,
    },
  ],
})
export class DashboardFileProcessorModule {}
