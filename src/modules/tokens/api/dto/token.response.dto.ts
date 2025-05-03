import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty({ description: 'ID do token', example: '1' })
  id: string;

  @ApiProperty({ description: 'Nome do token', example: 'Token A' })
  name: string;

  @ApiProperty({ description: 'Hash do token', example: 'abc123' })
  hash: string;

  @ApiProperty({ description: 'Descrição do token', example: 'Token de exemplo.' })
  description: string;

  @ApiProperty({ description: 'Dias de maturidade', example: 30 })
  maturityTimeDays: number;

  @ApiProperty({ description: 'Percentual de rendimento', example: 5.5 })
  yieldPercentage: number;

  @ApiProperty({ description: 'Token está ativo?', example: true })
  isActive: boolean;

  @ApiProperty({ description: 'Intervalos de rendimento', example: [1, 7, 30], required: false, type: [Number] })
  yieldInterval?: number[];

  @ApiProperty({ description: 'Data de criação', example: '2025-05-03T00:00:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização', example: '2025-05-03T00:00:00Z' })
  updatedAt: Date;
}
