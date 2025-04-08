import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import AppEnvs from './infrastructure/config/app.config';
import { DataBaseModule } from './infrastructure/database/database.module';
import { SESModule } from './infrastructure/providers/aws/ses/ses.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CognitoModule } from './infrastructure/providers/aws/cognito/cognito.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { ExtractModule } from './modules/extract/extract.module';
import { UploadFileModule } from './modules/upload-file/upload.file.module';
import { TransferModule } from './modules/transfer/transfer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [AppEnvs] }),
    DataBaseModule,
    AuthModule,
    UserModule,
    SESModule,
    CognitoModule,
    TransactionsModule,
    ExtractModule,
    UploadFileModule,
    TransferModule
  ],
})
export class ApiModule {}
