import { Entity, Column } from 'typeorm';
import { BaseEntity } from './commons/base.entity';

@Entity('update-files')
export class UpdateFiles extends BaseEntity{
  @Column()
  link: string;

  @Column()
  status: string;

  @Column() 
  user_id: string;

  @Column()
  hash: string;
}