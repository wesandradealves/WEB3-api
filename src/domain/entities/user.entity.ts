import { Column, Entity, OneToMany } from 'typeorm';
import { ProfileUserEnum } from '../commons/enum/profile.user.enum';
import { BaseEntity } from './commons/base.entity';
import { AdjunctEntity } from './adjunct.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'user_bdm_id', type: 'integer', default: 0, unique: true })
  userBdmId: number;

  @Column({ name: 'user_market_id', type: 'uuid', unique: true })
  userMarketId: string;

  @Column({ name: 'profile', enum: ProfileUserEnum, default: ProfileUserEnum.USER })
  profile: ProfileUserEnum;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => AdjunctEntity, (adjunct) => adjunct.representative)
  adjuncts: AdjunctEntity[];
}
