import { UpdateFiles } from "@/domain/entities/update-files.entity";
import { IDashboardFileProcessorRepository } from "@/domain/repositories/dashboard-file-processor/dashboard-file.processor.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as csvParser from "csv-parser";
import { S3External } from "@/infrastructure/external/s3.external";
import { DashboardTransferList } from "@/domain/entities/dashboard-transfer-list.entity";
import { TransferStatusEnum } from "@/domain/enums/transfer.status.enum";
import { UpdateFileEnum } from "@/domain/enums/update.file.enum";


@Injectable()
export class DashboardFileProcessor implements IDashboardFileProcessorRepository {
  constructor(
    @InjectRepository(UpdateFiles)
    private readonly updateFiles: Repository<UpdateFiles>,
    @InjectRepository(DashboardTransferList)
    private readonly DashboardTransferList: Repository<DashboardTransferList>,
    private readonly s3External: S3External,
  ) {}

  async fileProcessor(): Promise<any> {
    const results = await this.updateFiles.find({ where: { status: UpdateFileEnum.UPLOADED } });
  
    for (const file of results) {
      try {
        console.log(`[FileProcessor] - Processing file: ${file.link}`);
  
        const fileStream = await this.s3External.downloadFile(file.link);
  
        const data = await this.parseCsv(fileStream);
  
        const enrichedData = data.map((item) => ({
          asset: item.asset,
          name: item.name,
          wallet: item.wallet,
          amount: parseFloat(item.amount),
          email: item.email,
          obs: item.obs,
          status: TransferStatusEnum.PENDING,
          updateFileId: file.id,
        }));
  
        console.log(`[FileProcessor] - Processed data with IDs:`, enrichedData);
  
        for (const record of enrichedData) {
          const exists = await this.DashboardTransferList.findOne({
            where: {
              asset: record.asset,
              name: record.name,
              wallet: record.wallet,
              amount: record.amount,
              email: record.email,
              obs: record.obs,
              updateFileId: record.updateFileId,
            },
          });
  
          if (!exists) {
            await this.DashboardTransferList.save(record);
          } else {
            console.log(`[FileProcessor] - Skipping duplicate record:`, record);
          }
        }
      } catch (error) {
        console.error(`[FileProcessor] - Error processing file: ${file.link}`, error);
      }
    }
  }
  private parseCsv(stream: NodeJS.ReadableStream): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      stream
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
    });
  }
}