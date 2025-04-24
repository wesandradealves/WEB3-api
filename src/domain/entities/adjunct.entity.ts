import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './commons/base.entity';
import { UserEntity } from './user.entity'; // agora pode descomentar

@Entity('adjuncts')
export class AdjunctEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  nickname: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'user_bdm_id', type: 'integer', default: 0, unique: true })
  userBdmId: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => UserEntity, { nullable: false })
  @JoinColumn({ name: 'representative_id' })
  representative: UserEntity;

  @Column({ name: 'representative_id', type: 'uuid' })
  representativeId: string;
}
