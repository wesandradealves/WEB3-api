import { IBucketProvider } from '@/domain/interfaces/providers/bucket.provider';
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  GetObjectCommand,
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

  constructor(private readonly configService: ConfigService) {
    let options: S3ClientConfig;
    const isOffline = this.configService.get('isOffline');
    const isRunningInLambda = this.configService.get('isRunningInLambda');

    if (isOffline) {
      options = {
        region: this.configService.get('aws.auth.region'),
        credentials: {
          accessKeyId: 'minioadmin',
          secretAccessKey: 'minioadmin',
        },
        endpoint: 'http://localhost:9000',
      };
    }

    if (!isOffline && !isRunningInLambda) {
      options = {
        ...this.configService.get('aws.auth'),
        forcePathStyle: true,
      };
    }

    this.s3Client = new S3Client(options);
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
}
