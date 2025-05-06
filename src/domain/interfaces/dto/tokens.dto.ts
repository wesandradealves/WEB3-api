import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty({ description: 'Name of the token' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Hash of the token', required: false, readOnly: true })
  @IsOptional()
  @IsString()
  hash?: string;

  @ApiProperty({ description: 'Description of the token', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Decimal places of the token' })
  @IsNumber()
  decimalPlace: number;

  @ApiProperty({ description: 'Maturity time in days' })
  @IsNumber()
  maturityTimeDays: number;

  @ApiProperty({ description: 'Yield percentage of the token' })
  @IsNumber()
  yieldPercentage: number;

  @ApiProperty({ description: 'Whether the token is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Yield interval in days', required: false })
  @IsOptional()
  @IsNumber()
  yieldInterval?: number;
}

export class UpdateTokenDto extends PartialType(CreateTokenDto) {}