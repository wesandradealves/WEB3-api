export interface IDashboardFileProcessorRepository {
  fileProcessor(bucket: any, key: any): Promise<any>;
}

export const IDashboardFileProcessorRepository = Symbol('IDashboardFileProcessorRepository');
