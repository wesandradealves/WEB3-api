import { TransferStatusEnum } from "@/domain/commons/enum/transfer.status.enum";
import { ApiProperty } from "@nestjs/swagger";

export class GetAvailableTransfersDto {
  @ApiProperty({
    description: 'Unique identifier for the transfer',
    example: 'a85a01fb-79d5-4470-a43s-231eb6eba1a9',
  })
  id: string;

  @ApiProperty({
    description: 'Date when the transfer was created',
    example: '2025-03-25T23:09:41.407Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the transfer was last updated',
    example: '2025-03-25T23:09:41.407Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Unique identifier for the update file associated with the transfer',
    example: '915e7987-0b3c-4aed-a0a9-e029e1809aae',
  })
  updateFileId: string;

  @ApiProperty({
    description: 'The asset being transferred',
    example: 'BDM',
  })
  asset: string;

  @ApiProperty({
    description: 'The name associated with the transfer',
    example: 'Teste de gravação2',
  })
  name: string;

  @ApiProperty({
    description: 'The wallet address associated with the transfer',
    example: '1079',
  })
  wallet: string;

  @ApiProperty({
    example: 'fulano@email.com',
    description: 'Email address of the user associated with the transfer',
  })
  email: string;

  @ApiProperty({
    description: 'The amount being transferred',
    example: '3.00',
  })
  amount: string;

  @ApiProperty({
    description: 'Additional notes or comments about the transfer',
    example: 'teste2',
  })
  obs: string;

  @ApiProperty({
    description: 'The status of the transfer',
    example: TransferStatusEnum.PENDING,
    enum: TransferStatusEnum,
  })
  status: TransferStatusEnum;
}
