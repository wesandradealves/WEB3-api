import { IExtractDto } from '@/domain/interfaces/dto/extract/extract.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class ExtractDto implements IExtractDto {
  @ApiProperty({ type: Number }) // Define explicitamente o tipo como Number
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  walletId: number;

  @ApiProperty({ type: String }) // Define explicitamente o tipo como String
  @IsString()
  username: string;

  @ApiProperty({ type: Number }) // Define explicitamente o tipo como Number
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit: number;
}