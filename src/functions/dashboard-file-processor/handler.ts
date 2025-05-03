import { NestFactory } from '@nestjs/core';
import { IDashboardFileProcessorRepository } from '../../domain/repositories/dashboard-file-processor/dashboard-file.processor.repository';
import { DashboardFileProcessorModule } from './dashboard-file-processor.module';

export async function createInstance(): Promise<IDashboardFileProcessorRepository> {
  const server = await NestFactory.createApplicationContext(DashboardFileProcessorModule);
  return server.get<IDashboardFileProcessorRepository>(IDashboardFileProcessorRepository);
}

export const handler = async (context: any): Promise<void> => {
  console.log('context', context);
  const objecValue = context.Records[0].s3;

  try {
    const instance = await createInstance();
    console.log('[Handler] - start dashboard file processor.');
    await instance.fileProcessor(objecValue.bucket.name, objecValue.object.key);
  } catch (error) {
    console.error(error);
  }
};
