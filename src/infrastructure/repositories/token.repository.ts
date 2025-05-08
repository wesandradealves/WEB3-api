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
    private readonly tokenRepository: Repository<PrefixTokenEntity>,
  ) {}

  async create(token: PrefixTokenEntity): Promise<PrefixTokenEntity> {
    return this.tokenRepository.save(token);
  }

  async findAll(): Promise<PrefixTokenEntity[]> {
    try {
      return await this.tokenRepository.find();
    } catch (error) {
      console.error('TokentokenRepositorysitory: Error fetching tokens', error);
      throw error;
    }
  }

  async findById(id: string): Promise<PrefixTokenEntity> {
    return await this.tokenRepository.findOne({ where: { id } });
  }

  async update(id: string, token: UpdateTokenDto): Promise<void> {
    await this.tokenRepository.update(id, token);
  }

  async delete(id: string): Promise<void> {
    await this.tokenRepository.delete(id);
  }
}
