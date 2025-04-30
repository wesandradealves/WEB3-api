import { Entity, Column } from 'typeorm';
import { BaseEntity } from './commons/base.entity';
import { UploadedFileEnum } from '../commons/enum/uploaded.file.enum';

@Entity('uploaded_files')
export class UploadedFiles extends BaseEntity{
  @Column()
  link: string;

  @Column({
    type: "enum",
    enum: UploadedFileEnum,
    default: UploadedFileEnum.UPLOADED,
  })
  status: string;

  @Column({ name: 'user_id' }) 
  userId: string;

  @Column()
  hash: string;
}