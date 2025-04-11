import { UpdateFiles } from '@/domain/entities/update-files.entity';
import { UpdateFileEnum } from '@/domain/enums/update.file.enum';
import { IBucketProvider } from '@/domain/interfaces/providers/bucket.provider';
import { ISendCsvUseCase } from '@/domain/interfaces/use-cases/update-file/send.csv.use-case';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SendCsvUseCase implements ISendCsvUseCase {
  private readonly bucket: string;
  private readonly logger = new Logger(SendCsvUseCase.name); // Logger instanciado com o nome da classe

  constructor(
    @Inject(IBucketProvider)
    private readonly bucketProvider: IBucketProvider,
    @InjectRepository(UpdateFiles)
    private readonly updateFiles: Repository<UpdateFiles>,
  ) {
    this.bucket = process.env.BUCKET_NAME;
    this.logger.debug(`Bucket name set to: ${this.bucket}`);
  }

  async execute(file: Express.Multer.File, userId: string): Promise<any> {
    const path = `uploads/${file.originalname}`;
    this.logger.log(`Uploading file: ${file.originalname} to path: ${path}`);
    const hash = this.generateHash(file.buffer);

    try {
      if (!Buffer.isBuffer(file.buffer)) {
        throw new Error('File buffer is not a valid Buffer');
      }
  
      this.logger.debug(`File buffer length: ${file.buffer.length}`);
  
      // Verifica se o hash já existe no banco de dados
      const existingFile = await this.updateFiles.findOne({ where: { hash } });
      if (existingFile) {
        this.logger.warn(`File with hash ${hash} already exists in the database.`);
        return {
          message: 'File already uploaded',
        };
      }
  
      // Gravando arquivo no bucket
      await this.bucketProvider.uploadFile(
        this.bucket,
        path,
        file.buffer,
      );
  
      this.logger.log(`File uploaded successfully: ${file.originalname}`);
  
      // Salvando link no banco update-files
      const updateFile = this.updateFiles.create({
        link: `https://${this.bucket}.s3.amazonaws.com/${path}`,
        status: UpdateFileEnum.UPLOADED,
        user_id: userId,
        hash: hash,
      });
  
      await this.updateFiles.save(updateFile);
  
      return {
        message: 'File uploaded successfully',
      };
    } catch (error) {
      this.logger.error(`Failed to upload file: ${file.originalname}`, error.stack);
      throw error;
    }
  }

  private generateHash(buffer: Buffer): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}