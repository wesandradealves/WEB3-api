import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class TransactionsDto {
  @ApiProperty()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  walletId: number;

  @ApiProperty()
  @IsString()
  username: string;
}