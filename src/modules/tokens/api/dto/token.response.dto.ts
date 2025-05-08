import { IViewToken } from '@/domain/types/token';
import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto implements IViewToken {
  decimalPlace: number;
  id: string;
  deletedAt: Date;

  @ApiProperty({ description: 'Nome do token', example: 'Token A' })
  asset: string;

  @ApiProperty({ description: 'Hash', example: 'abc123' })
  hash: string;

  @ApiProperty({ description: 'Descrição do token', example: 'Token de exemplo.' })
  description: string;

  @ApiProperty({ description: 'Dias de maturidade', example: 30 })
  maturityTimeDays: number;

  @ApiProperty({ description: 'Percentual de rendimento', example: 5.5 })
  yieldPercentage: number;

  @ApiProperty({ description: 'Token está ativo?', example: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Intervalo de rendimento',
    example: 1,
    required: false,
    type: Number,
  })
  yieldInterval: number;

  @ApiProperty({ description: 'Data de criação', example: '2025-05-03T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2025-05-03T00:00:00Z' })
  updatedAt: Date;
}
