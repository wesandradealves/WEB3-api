import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceDashBoard } from './config/postgres.provider';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => Object.assign(dataSourceDashBoard, { autoLoadEntities: true }),
    }),
  ],
  exports: [],
})
export class DataBaseModule {}
