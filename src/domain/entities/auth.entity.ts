import { Column, Entity } from 'typeorm';
import { BaseEntity } from './commons/base.entity';

@Entity('auths')
export class AuthEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'refresh_token', type: 'varchar' })
  refreshToken: string;
}
