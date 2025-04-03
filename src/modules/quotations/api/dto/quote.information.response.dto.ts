import { ApiProperty } from "@nestjs/swagger";

export class QuotationInformationResponseDto {

  @ApiProperty({
    example: 5.25,
    description: 'Quotation in BRL',
  })
  BRL: number;

  @ApiProperty({
    example: 1.05,
    description: 'Quotation in USD',
  })
  USD: number;

  @ApiProperty({
    example: 0.95,
    description: 'Quotation in EUR',
  })
  EUR: number;

  @ApiProperty({
    example: 3.85,
    description: 'Quotation in AED',
  })
  AED: number;

  @ApiProperty({
    example: 'Dubai_9',
    description: 'Asset name',
  })
  asset: string;
}