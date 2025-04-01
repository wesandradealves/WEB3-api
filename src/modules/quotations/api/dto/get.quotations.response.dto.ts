import { ApiProperty } from "@nestjs/swagger";

export class HoldingTokenResponseDto {
  @ApiProperty()
  asset: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  withdrawBlockInDays: number;

  @ApiProperty()
  liquidityInDays: number;

  @ApiProperty()
  price: {
    asset: string;
    value: number;
  };

  @ApiProperty()
  income: {
    asset: string;
    fixedValue: number;
    rate: number;
    periodInDays: number;
  };
}

export class CurrencyResponseDto {
  @ApiProperty()
  asset: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'number',
    },
  })
  quotation: Record<string, number>;
}

export class GetQuotationsResponseDto {
  @ApiProperty({
    type: [CurrencyResponseDto],
  })
  currencies: CurrencyResponseDto[];

  @ApiProperty({
    type: [HoldingTokenResponseDto],
  })
  holdingTokens?: HoldingTokenResponseDto[];
}

