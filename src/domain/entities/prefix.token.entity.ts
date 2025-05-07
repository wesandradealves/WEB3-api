import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { randomBytes } from 'crypto';

@Entity('prefix_tokens')
export class PrefixTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'maturity_time_days', type: 'integer' })
  maturityTimeDays: number;

  @Column({ name: 'yield_percentage', type: 'decimal', precision: 5, scale: 2 })
  yieldPercentage: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'hash', type: 'varchar', length: 255, unique: true })
  hash: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'decimal_place', type: 'integer' })
  decimalPlace: number;

  @Column({ name: 'yield_interval', type: 'integer', nullable: true })
  yieldInterval: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @BeforeInsert()
  beforeInsert(): void {
    this.generateHash();
  }

  private generateHash(): void {
    if (!this.hash) {
      this.hash = randomBytes(16).toString('hex');
    }
  }
}
