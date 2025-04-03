import { ApiProperty } from "@nestjs/swagger";

export class UserWalletResponseDto {
  @ApiProperty({
    type: Number,
    description: "Wallet ID",
    example: 1234,
  })
  id: number;

  @ApiProperty({
    type: String,
    description: "Wallet name",
    example: "CARTEIRA PRINCIPAL",
  })
  name: string;

  @ApiProperty({
    type: String,
    description: "Wallet address",
    example: "0xasda...",
  })
  address: string;

  @ApiProperty({
    type: Boolean,
    description: "Is wallet imported",
    example: false,
  })
  imported: boolean;

  @ApiProperty({
    type: Boolean,
    description: "Is wallet default",
    example: true,
  })
  isDefault: boolean;

  @ApiProperty({
    type: String,
    description: "Wallet sell tax",
    example: "10",
  })
  sellTax: string;

  @ApiProperty({
    type: String,
    description: "Wallet type",
    example: "APP",
  })
  type: string;
}