import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdjunctEntity } from '@/domain/entities/adjunct.entity';
import { IAdjunctRepository } from '@/domain/interfaces/repositories/adjunct.repository';

@Injectable()
export class AdjunctRepository implements IAdjunctRepository {
  constructor(
    @InjectRepository(AdjunctEntity)
    private readonly repo: Repository<AdjunctEntity>,
  ) {}

  async create(data: Partial<AdjunctEntity>): Promise<AdjunctEntity> {
    const adjunct = this.repo.create(data);
    return this.repo.save(adjunct);
  }

  async findAll(): Promise<AdjunctEntity[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<AdjunctEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async update(adjunct: AdjunctEntity): Promise<AdjunctEntity> {
    return this.repo.save(adjunct);
  }
}
