import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { TokenUseCases } from '../use-cases/token.use-cases';
import { CreateTokenDto, UpdateTokenDto } from '../../../domain/interfaces/dto/tokens.dto';
import { JwtAuthGuard } from '../../auth/jwt.auth.guard';

@Controller('tokens')
@UseGuards(JwtAuthGuard)
export class TokensController {
  constructor(private readonly tokenUseCases: TokenUseCases) {}

  @Post()
  async createToken(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenUseCases.createToken(createTokenDto);
  }

  @Get()
  async getAllTokens() {
    return this.tokenUseCases.getAllTokens();
  }

  @Get(':id')
  async getTokenById(@Param('id') id: string) {
    return this.tokenUseCases.getTokenById(id);
  }

  @Put(':id')
  async updateToken(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
    return this.tokenUseCases.updateToken(id, updateTokenDto);
  }

  @Delete(':id')
  async deleteToken(@Param('id') id: string) {
    return this.tokenUseCases.deleteToken(id);
  }
}