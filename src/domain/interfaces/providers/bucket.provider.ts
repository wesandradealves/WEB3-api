export interface IBucketProvider {
  uploadFile(bucketName: string, filePath: string, fileContent: Buffer): Promise<string>;
  download(Bucket: any, Key: string): Promise<any>;
  deleteFile(bucketName: string, filePath: string): Promise<void>;
}

export const IBucketProvider = Symbol('IBucketProvider');
