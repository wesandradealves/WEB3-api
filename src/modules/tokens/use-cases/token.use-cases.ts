import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrefixTokenEntity } from '../../../domain/entities/prefix.token.entity';
import {
  CreateTokenDto,
  UpdateTokenDto,
} from '../../../domain/interfaces/dto/tokens.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class TokenUseCases {
  constructor(
    @InjectRepository(PrefixTokenEntity)
    private readonly tokenRepository: Repository<PrefixTokenEntity>,
  ) {}

  async createToken(createTokenDto: CreateTokenDto): Promise<PrefixTokenEntity> {
    const existingTokenByName = await this.tokenRepository.findOneBy({
      name: createTokenDto.name,
    });
    if (existingTokenByName) {
      throw new Error('A token with this name already exists.');
    }

    createTokenDto.hash = randomBytes(16).toString('hex');

    const token = this.tokenRepository.create(createTokenDto);
    return this.tokenRepository.save(token);
  }

  async updateToken(
    id: number,
    updateTokenDto: UpdateTokenDto,
  ): Promise<PrefixTokenEntity> {
    await this.tokenRepository.update(id, updateTokenDto);
    return this.tokenRepository.findOneBy({ id });
  }

  async getTokenById(id: number): Promise<PrefixTokenEntity> {
    return this.tokenRepository.findOneBy({ id });
  }

  async getAllTokens(): Promise<PrefixTokenEntity[]> {
    return this.tokenRepository.find();
  }

  async deleteToken(id: number): Promise<void> {
    await this.tokenRepository.delete(id);
  }
}
