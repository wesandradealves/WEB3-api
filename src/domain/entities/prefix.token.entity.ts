import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './commons/base.entity';
import { PrefixInvestmentEntity } from './prefix.investment.entity';

@Entity('prefix_tokens')
export class PrefixTokenEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  hash: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'maturity_time_days', type: 'integer' })
  maturityTimeDays: number;

  @Column({ name: 'yield_percentage', type: 'decimal', precision: 5, scale: 2 })
  yieldPercentage: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'yield_interval', type: 'int', array: true, nullable: true })
  yieldInterval?: number[];

  @OneToMany(() => PrefixInvestmentEntity, (investment) => investment.token)
  prefixInvestments: PrefixInvestmentEntity[];
}
