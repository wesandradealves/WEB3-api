import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './commons/base.entity';
import { UpdateFiles } from './update-files.entity';

@Entity('dashboard_transfer_list')
export class DashboardTransferList extends BaseEntity {
  @ManyToOne(() => UpdateFiles, (updateFile) => updateFile.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'update_file_id' }) 
  updateFile: UpdateFiles;

  @Column({ name: 'update_file_id', type: 'uuid' })
  updateFileId: string;

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

  @Column({ type: 'varchar', length: 50 })
  status: string;
}