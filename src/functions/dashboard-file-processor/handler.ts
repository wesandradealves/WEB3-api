import { NestFactory } from '@nestjs/core';
import { IDashboardFileProcessorRepository } from '../../domain/repositories/dashboard-file-processor/dashboard-file.processor.repository';
import { DashboardFileProcessorModule } from './dashboard-file-processor.module';

export async function createInstance(): Promise<IDashboardFileProcessorRepository> {
  const server = await NestFactory.createApplicationContext(DashboardFileProcessorModule);
  return server.get<IDashboardFileProcessorRepository>(IDashboardFileProcessorRepository);
}

export const handler = async (): Promise<void> => {
  try {
    const instance = await createInstance();
    console.log('[Handler] - start dashboard file processor.');
    await instance.fileProcessor();
  } catch (error) {
    console.error(error);
  }
};
