import { IUpdateToken } from '@/domain/types/token';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class UpdateTokenDto implements IUpdateToken {
  decimalPlace: number;

  @ApiProperty({ description: 'Nome do token', example: 'Token A' })
  @IsString()
  @IsNotEmpty()
  asset: string;

  @ApiProperty({ description: 'Hash do token', example: 'abc123' })
  @IsString()
  @IsNotEmpty()
  hash: string;

  @ApiProperty({ description: 'Descrição do token', example: 'Token de exemplo.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Dias de maturidade', example: 30 })
  @IsInt()
  @IsPositive()
  maturityTimeDays: number;

  @ApiProperty({ description: 'Percentual de rendimento', example: 5.5 })
  @IsNumber()
  yieldPercentage: number;

  @ApiProperty({ description: 'Token está ativo?', example: true })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Intervalos de rendimento',
    required: false,
    type: Number,
  })
  @IsOptional()
  @IsInt({ each: true })
  yieldInterval: number;
}
