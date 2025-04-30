import { NestFactory } from '@nestjs/core';
import { DashboardTransferAssetsModule } from './dashboard-transfer-assets.module';
import { ITransferAssetUseCase } from '@/domain/interfaces/use-cases/transfer/transfer.asset.user-case';

export async function createInstance(): Promise<ITransferAssetUseCase> {
  try {
    const server = await NestFactory.createApplicationContext(
      DashboardTransferAssetsModule,
      {
        logger: ['error', 'warn', 'log', 'debug'],
      }
    );
    
    return server.get<ITransferAssetUseCase>(ITransferAssetUseCase);
  } catch (error) {
    console.error('Failed to create application context:', error);
    throw error;
  }
}


export const handler = async (event: any): Promise<void> => {
  try {
    const instance = await createInstance();
    console.log(event)
    console.log('[Handler] - start transfer assets.');
    await instance.execute(event);
  } catch (error) {
    console.error(error);
  }
};
