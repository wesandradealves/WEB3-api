import { UpdateFiles } from "@/domain/entities/update-files.entity";
import { IDashboardFileProcessorRepository } from "@/domain/repositories/dashboard-file-processor/dashboard-file.processor.repository";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as csvParser from "csv-parser";
import { S3External } from "@/infrastructure/external/s3.external";
import { DashboardTransferList } from "@/domain/entities/dashboard-transfer-list.entity";


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
    // Busca os arquivos com status 'uploaded'
    const results = await this.updateFiles.find({ where: { status: 'uploaded' } });
  
    for (const file of results) {
      try {
        console.log(`[FileProcessor] - Processing file: ${file.link}`);
  
        const fileStream = await this.s3External.downloadFile(file.link);
  
        const data = await this.parseCsv(fileStream);
  
        // Adiciona o update_file_id ao data e mapeia para o formato esperado pelo banco
        const enrichedData = data.map((item) => ({
          asset: item.asset,
          name: item.name,
          wallet: item.wallet,
          amount: parseFloat(item.amount), // Converte para número, se necessário
          email: item.email,
          obs: item.obs,
          status: item.status || 'pending', // Define um valor padrão, se necessário
          updateFileId: file.id, // Adiciona o ID do arquivo como chave
        }));
  
        console.log(`[FileProcessor] - Processed data with IDs:`, enrichedData);
  
        // Verifica se os registros já existem na tabela
        for (const record of enrichedData) {
          const exists = await this.DashboardTransferList.findOne({
            where: {
              asset: record.asset,
              name: record.name,
              wallet: record.wallet,
              amount: record.amount,
              email: record.email,
              obs: record.obs,
              status: record.status,
              updateFileId: record.updateFileId,
            },
          });
  
          if (!exists) {
            // Insere apenas se o registro não existir
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