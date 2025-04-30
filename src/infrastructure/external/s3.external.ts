import { Injectable } from "@nestjs/common";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

@Injectable()
export class S3External {
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: "us-east-2",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      },
    });
  }

  async downloadFile(s3Url: string): Promise<Readable> {
    const { Bucket, Key } = this.parseS3Url(s3Url);

    const command = new GetObjectCommand({ Bucket, Key });
    const response = await this.s3Client.send(command);

    if (!response.Body || !(response.Body instanceof Readable)) {
      throw new Error("Failed to download file from S3");
    }

    return response.Body as Readable;
  }

  private parseS3Url(s3Url: string): { Bucket: string; Key: string } {
    let bucket: string;
    let key: string;
  
    if (s3Url.startsWith("s3://")) {
      const match = s3Url.match(/^s3:\/\/([^/]+)\/(.+)$/);
      if (!match) {
        throw new Error(`Invalid S3 URL: ${s3Url}`);
      }
      bucket = match[1];
      key = match[2];
    } else if (s3Url.startsWith("http://") || s3Url.startsWith("https://")) {

      const url = new URL(s3Url);
      bucket = url.hostname.split(".")[0];
      key = url.pathname.substring(1);
    } else {
      throw new Error(`Invalid S3 URL: ${s3Url}`);
    }
  
    return { Bucket: bucket, Key: key };
  }
}