import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";
import { ConsolidateTransactionsEnum } from "@/domain/commons/enum/consolidate.transactios.enum";
import { FileFormat } from "@/infrastructure/repositories/services/FileExportService";


export enum downloadFormat {
  NONE = 'none',
  EXCEL = 'excel',
  CSV = 'csv'
}

export class ConsolidateTransactionsDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  walletId: number;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  type: ConsolidateTransactionsEnum;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  after: number;

  @ApiProperty()
  downloadFormat?: FileFormat;
}