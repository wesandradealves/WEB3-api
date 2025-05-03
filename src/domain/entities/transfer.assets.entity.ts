import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './commons/base.entity';
import { UploadedFiles } from './uploaded.files.entity';
import { TransferStatusEnum } from '../commons/enum/transfer.status.enum';

@Entity('transfer_assets')
export class DashboardTransferList extends BaseEntity {
  @ManyToOne(() => UploadedFiles, (updateFile) => updateFile.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploaded_file_id' }) 
  uploadedFile: UploadedFiles;

  @Column({ type: 'varchar', length: 255 })
  asset: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  wallet: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'text', nullable: true })
  obs: string;

  @Column({ 
    type: "enum",
    enum: TransferStatusEnum,
    default: TransferStatusEnum.PENDING,
  })
  status: string;
}