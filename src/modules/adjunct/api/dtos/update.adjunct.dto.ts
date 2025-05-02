import { IsString } from 'class-validator';

export class UpdateAdjunctDto {
  @IsString()
  surname: string;
}
