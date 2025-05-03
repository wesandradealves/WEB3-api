import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({ description: 'Nome do token', example: 'Token A' })
  @IsString()
  @IsNotEmpty()
  name: string;

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

  @ApiProperty({ description: 'Intervalos de rendimento', example: [1, 7, 30], required: false, type: [Number] })
  @IsOptional()
  @IsInt({ each: true })
  yieldInterval?: number[];
}
