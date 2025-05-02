import { AdjunctEntity } from '@/domain/entities/adjunct.entity';

export interface IAdjunctRepository {
  create(data: Partial<AdjunctEntity>): Promise<AdjunctEntity>;
  findAll(): Promise<AdjunctEntity[]>;
  findById(id: string): Promise<AdjunctEntity | null>;
  update(adjunct: AdjunctEntity): Promise<AdjunctEntity>;
}

export const IAdjunctRepository = Symbol('IAdjunctRepository');
