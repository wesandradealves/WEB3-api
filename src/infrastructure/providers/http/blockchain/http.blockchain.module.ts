import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpBlockchainProvider } from './http.blockchain.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true })
  ],
  providers: [
    Logger,
    HttpBlockchainProvider
  ],
  
  exports: [HttpBlockchainProvider],
})
export class HttpBlochChainModule {}
