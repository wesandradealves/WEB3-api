import { ITokenRepository } from '@/domain/interfaces/repositories/token.repository';
import { UpdateTokenDto } from '@/modules/tokens/api/dto/update-token.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PrefixTokenEntity } from 'src/domain/entities/prefix.token.entity';
import { Repository } from 'typeorm';

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

  async findById(id: string): Promise<PrefixTokenEntity> {
    return await this.repo.findOne({ where: { id } });
  }

  async update(id: string, token: UpdateTokenDto): Promise<void> {
    await this.repo.update(id, token);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
