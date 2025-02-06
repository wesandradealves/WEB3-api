import { IAuthExetrnal } from '@/domain/interfaces/auth/auth.external';
import { AuthExternal } from '@/infrastructure/external/auth.external';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpBdmProvider } from './http.bdm.provider';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [
    Logger,
    HttpBdmProvider,
    {
      provide: IAuthExetrnal,
      useClass: AuthExternal,
    },
  ],
  exports: [HttpBdmProvider, IAuthExetrnal],
})
export class HttpModule {}
