import { ApiProperty } from '@nestjs/swagger';

export class TransactionsResponseDto {
  @ApiProperty({ example: 1000, description: 'Total amount of transactions' })
  totalAmount: number;

  @ApiProperty({ example: -500, description: 'Total amount sent' })
  totalSent: number;

  @ApiProperty({ example: 500, description: 'Total amount received' })
  totalReceived: number;
}