import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  PutObjectCommandInput,
  GetObjectCommandInput,
  DeleteObjectCommandInput,
  ListObjectsV2CommandInput,
} from '@aws-sdk/client-s3';
import { IBucketProvider } from '@/domain/interfaces/providers/bucket.provider';

@Injectable()
export class BucketProvider implements IBucketProvider {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor() {
    if(process.env.IS_OFFLINE === 'true'){
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
        endpoint: "http://localhost:9000", 
      });
    }else{
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true,
      });
    }
    
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

  async getFile(key: string): Promise<any> {
    const params: GetObjectCommandInput = {
      Bucket: this.bucketName,
      Key: key,
    };

    const command = new GetObjectCommand(params);
    return this.s3Client.send(command);
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