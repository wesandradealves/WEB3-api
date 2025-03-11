import { ApiProperty } from '@nestjs/swagger';

export class ExtractResponseDto {
  @ApiProperty({ example: 29018 })
  id: number;

  @ApiProperty({ example: 1736703291945 })
  data: number;

  @ApiProperty({ example: 'saida ou entrada' })
  movimentationType: string;

  @ApiProperty({ example: 'nome de quem envia' })
  sender: string;

  @ApiProperty({ example: 'nome de quem recebe' })
  receiver: string;

  @ApiProperty({ example: -1 })
  transactionsAmount: number;

  @ApiProperty({ example: -0.99 })
  totalTransactionsAmount: number;
}