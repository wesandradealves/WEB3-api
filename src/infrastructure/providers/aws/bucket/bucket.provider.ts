import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommandInput,

  DeleteObjectCommandInput,
  ListObjectsV2CommandInput,
} from '@aws-sdk/client-s3';
import { IBucketProvider } from '@/domain/interfaces/providers/bucket.provider';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BucketProvider implements IBucketProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService, // Replace with your actual config service type
  ) {
      this.s3Client = new S3Client({
        ...this.configService.get('aws'),
        endpoint: this.configService.get('aws.s3.endpoint'),
        forcePathStyle: true,
      });
  }

  async uploadFile(bucketName: string, filePath: string, fileContent: Buffer): Promise<any> {
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: filePath,
      Body: fileContent,
    };
  
    const command = new PutObjectCommand(params);
    return this.s3Client.send(command);
  }

  async download(Bucket: any, Key: any): Promise<any> {
    const command = new GetObjectCommand({ Bucket, Key });
    return await this.s3Client.send(command);
  }

  async deleteFile(key: string): Promise<void> {
    const params: DeleteObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new DeleteObjectCommand(params);
    await this.s3Client.send(command);
  }

  async listFiles(prefix: string = ''): Promise<any> {
    const params: ListObjectsV2CommandInput = {
      Bucket: this.bucketName,
      Prefix: prefix,
    };

    const command = new ListObjectsV2Command(params);
    return this.s3Client.send(command);
  }

  downloadFile(bucketName: string, filePath: string): Promise<any> {
    console.log('downloadFile', bucketName, filePath);
    return Promise.resolve();
  }
}