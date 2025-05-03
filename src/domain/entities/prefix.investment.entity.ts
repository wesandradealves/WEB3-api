import { Entity, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from './commons/base.entity';
import { PrefixTokenEntity } from './prefix.token.entity';

@Entity('prefix_investments')
export class PrefixInvestmentEntity extends BaseEntity {
  @Column()
  amount: number;

  @ManyToOne(() => PrefixTokenEntity, (token) => token.prefixInvestments)
  token: PrefixTokenEntity;
}
