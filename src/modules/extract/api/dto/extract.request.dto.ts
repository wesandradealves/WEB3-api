import { IExtractRequest } from '@/domain/interfaces/dto/extract/extract.request';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ExtractRequestDto implements IExtractRequest {
  @ApiProperty({ type: 'number' })
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  limit: number;

  @ApiProperty({ type: 'string' })
  @IsString()
  username: string;

  @ApiProperty({ type: 'number', example: 10 })
  @Type(() => Number)
  @IsNumber()
  walletId: number;
}
