export interface IDashboardFileProcessorRepository {
  fileProcessor(): Promise<any>;
}

export const IDashboardFileProcessorRepository = Symbol('IDashboardFileProcessorRepository');
