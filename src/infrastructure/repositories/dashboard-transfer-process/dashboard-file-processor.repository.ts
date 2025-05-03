import { IDashboardFileProcessorRepository } from "@/domain/repositories/dashboard-file-processor/dashboard-file.processor.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as csvParser from "csv-parser";
import { S3External } from "@/infrastructure/external/s3.external";
import { DashboardTransferList } from "@/domain/entities/transfer.assets.entity";
import { TransferStatusEnum } from "@/domain/commons/enum/transfer.status.enum";
import { UploadedFiles } from "@/domain/entities/uploaded.files.entity";


@Injectable()
export class DashboardFileProcessor implements IDashboardFileProcessorRepository {
  constructor(
    @InjectRepository(UploadedFiles)
    private readonly updateFiles: Repository<UploadedFiles>,
    @InjectRepository(DashboardTransferList)
    private readonly DashboardTransferList: Repository<DashboardTransferList>,
    private readonly s3External: S3External,
  ) {}

  async fileProcessor(bucketName: string, key: string): Promise<any> {
      try {  
        const results = await this.updateFiles.findOne({ where: { link: key} });
        const fileStream = await this.s3External.downloadFile(bucketName, key);
  
        const data = await this.parseCsv(fileStream);
  
        const enrichedData = data.map((item) => ({
          asset: item.asset,
          name: item.name,
          wallet: item.wallet,
          amount: parseFloat(item.amount),
          email: item.email,
          obs: item.obs,
          status: TransferStatusEnum.PENDING,
          uploadedFile: {
            id: results.id,},
        }));
  
        console.log(`[FileProcessor] - Processed data with IDs:`, enrichedData);
        await this.DashboardTransferList.save(enrichedData);
        
      } catch (error) {
        console.error(`[FileProcessor] - Error processing file: `, error);
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