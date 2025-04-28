import { IAuthExetrnal } from '@/domain/interfaces/auth/auth.external';
import { ICognitoProvider } from '@/domain/interfaces/providers/cognito/cognito.provider';
import { AuthExternal } from '@/infrastructure/external/auth.external';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CognitoProvider } from '../aws/cognito/cognito.provider';
import { HttpBdmProvider } from './http.bdm.provider';
import { CognitoModule } from '../aws/cognito/cognito.module';
import { IBdmExternal } from '@/domain/interfaces/external/bdm.external';
import { BdmExternal } from '@/infrastructure/external/bdm.external';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CognitoModule],
  providers: [
    Logger,
    HttpBdmProvider,
    {
      provide: IAuthExetrnal,
      useClass: AuthExternal,
    },
    {
      provide: IBdmExternal,
      useClass: BdmExternal,
    },
    {
      provide: ICognitoProvider,
      useClass: CognitoProvider,
    },
  ],
  exports: [HttpBdmProvider, IAuthExetrnal, IBdmExternal],
})
export class HttpModule {}
