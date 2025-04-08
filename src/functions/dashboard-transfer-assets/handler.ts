import { NestFactory } from '@nestjs/core';
import { DashboardTransferAssetsModule } from './dashboard-transfer-assets.module';
import { ITransferAssetUseCase } from '@/domain/interfaces/use-cases/transfer/transfer.asset.user-case';

export async function createInstance(): Promise<ITransferAssetUseCase> {
  const server = await NestFactory.createApplicationContext(DashboardTransferAssetsModule);
  return server.get<ITransferAssetUseCase>(ITransferAssetUseCase);
}

export const handler = async (event: any): Promise<void> => {
  try {
    const instance = await createInstance();
    const body = JSON.parse(event.Records[0].body)
    console.log('[Handler] - start transfer assets.');
    await instance.execute(body);
  } catch (error) {
    console.error(error);
  }
};
