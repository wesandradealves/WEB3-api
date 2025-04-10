import { Entity, Column } from 'typeorm';
import { BaseEntity } from './commons/base.entity';
import { UpdateFileEnum } from '../enums/update.file.enum';

@Entity('update-files')
export class UpdateFiles extends BaseEntity{
  @Column()
  link: string;

  @Column({
    type: "enum",
    enum: UpdateFileEnum,
    default: UpdateFileEnum.UPLOADED,
  })
  status: string;

  @Column() 
  user_id: string;

  @Column()
  hash: string;
}