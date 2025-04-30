export interface IBucketProvider {
  uploadFile(bucketName: string, filePath: string, fileContent: Buffer): Promise<string>;
  downloadFile(bucketName: string, filePath: string): Promise<Buffer>;
  deleteFile(bucketName: string, filePath: string): Promise<void>;
  listFiles(bucketName: string, prefix?: string): Promise<string[]>;
}


export const IBucketProvider = Symbol('IBucketProvider');
