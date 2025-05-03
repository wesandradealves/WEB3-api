import { Inject, Injectable } from "@nestjs/common";
import { Readable } from "stream";
import { IBucketProvider } from "@/domain/interfaces/providers/bucket.provider";

@Injectable()
export class S3External {
  constructor(
    @Inject(IBucketProvider)
    private readonly bucketProvider: IBucketProvider,
  ) {
}

  async downloadFile(bucket: string, key: string): Promise<Readable> {;
    const response = await this.bucketProvider.download(
      bucket,
      key,
    )
   
    if (!response.Body || !(response.Body instanceof Readable)) {
      throw new Error("Failed to download file from S3");
    }

    return response.Body as Readable;
  }
}