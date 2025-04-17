import { ICognitoProvider } from '@/domain/interfaces/providers/cognito.provider';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CognitoProvider } from './cognito.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    Logger,
    {
      provide: ICognitoProvider,
      useClass: CognitoProvider,
    },
  ],
  exports: [ICognitoProvider],
})
export class CognitoModule {}
