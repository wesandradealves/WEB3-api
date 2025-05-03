import { IBucketProvider } from '@/domain/interfaces/providers/bucket.provider';
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BucketProvider implements IBucketProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(
    private readonly configService: ConfigService, // Replace with your actual config service type
  ) {
    let options: S3ClientConfig;

    if (this.configService.get('IS_OFFLINE') === 'true') {
      options = {
        endpoint: this.configService.get('aws.s3.endpoint'),
        ...this.configService.get('aws'),
      };
    } else {
      options = {
        ...this.configService.get('aws'),
      };
    }
    this.s3Client = new S3Client({
      ...options,
      forcePathStyle: true,
    });
  }

  async uploadFile(
    bucketName: string,
    filePath: string,
    fileContent: Buffer,
  ): Promise<any> {
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
