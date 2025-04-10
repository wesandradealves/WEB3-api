import { NestFactory } from '@nestjs/core';
import { DashboardTransferAssetsModule } from './dashboard-transfer-assets.module';
import { ITransferAssetUseCase } from '@/domain/interfaces/use-cases/transfer/transfer.asset.user-case';
import { HttpBlockchainProvider } from '@/infrastructure/providers/http/blockchain/http.blockchain.provider';

export async function createInstance(): Promise<ITransferAssetUseCase> {
  try {
    const server = await NestFactory.createApplicationContext(
      DashboardTransferAssetsModule,
      {
        logger: ['error', 'warn', 'log', 'debug'],
      }
    );
    
    // Test the HttpBlockchainProvider is properly injected
    const blockchainProvider = server.get(HttpBlockchainProvider);
    console.log('BlockchainProvider injected successfully:', !!blockchainProvider);
    
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
