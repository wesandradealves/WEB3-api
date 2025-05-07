import { Column, Entity } from 'typeorm';
import { BaseEntity } from './commons/base.entity';

@Entity('prefix_tokens')
export class PrefixTokenEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  asset: string;

  @Column({ name: 'maturity_time_days', type: 'integer' })
  maturityTimeDays: number;

  @Column({ name: 'yield_percentage', type: 'decimal', precision: 5, scale: 2 })
  yieldPercentage: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'decimal_place', type: 'integer' })
  decimalPlace: number;

  @Column({ name: 'yield_interval', type: 'integer', nullable: true })
  yieldInterval: number;
}
