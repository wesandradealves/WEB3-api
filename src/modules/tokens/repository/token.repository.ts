import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrefixTokenEntity } from 'src/domain/entities/prefix.token.entity';
import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';

@Injectable()
export class TokenRepository implements ITokenRepository {
  constructor(
    @InjectRepository(PrefixTokenEntity)
    private readonly repo: Repository<PrefixTokenEntity>,
  ) {}

  async create(token: PrefixTokenEntity): Promise<PrefixTokenEntity> {
    return this.repo.save(token);
  }

  async findAll(): Promise<PrefixTokenEntity[]> {
    try {
      const tokens = await this.repo.find();
      console.log('TokenRepository: Tokens found', tokens);
      return tokens;
    } catch (error) {
      console.error('TokenRepository: Error fetching tokens', error);
      throw error;
    }
  }

  async findById(id: string): Promise<PrefixTokenEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(token: PrefixTokenEntity): Promise<PrefixTokenEntity> {
    return this.repo.save(token);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
