export class CreateTokenDto {
  name: string;
  hash: string;
  description?: string;
  decimalPlace: number;
  maturityTimeDays: number;
  yieldPercentage: number;
  isActive: boolean;
  yieldInterval?: number;
}

export class UpdateTokenDto {
  name?: string;
  hash?: string;
  description?: string;
  decimalPlace?: number;
  maturityTimeDays?: number;
  yieldPercentage?: number;
  isActive?: boolean;
  yieldInterval?: number;
}