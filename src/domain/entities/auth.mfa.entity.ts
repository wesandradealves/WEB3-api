import { Column, Entity } from 'typeorm';
import { BaseEntity } from './commons/base.entity';

@Entity('auth-mfa')
export class AuthMfaEntity extends BaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'mfa', type: 'varchar' })
  mfa: string;

  @Column({ name: 'is_valid', type: 'boolean' })
  isValid: boolean;
}
