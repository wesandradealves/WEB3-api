import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { TokenUseCases } from '../use-cases/token.use-cases';
import { CreateTokenDto, UpdateTokenDto } from '../../../domain/interfaces/dto/tokens.dto';
import { ApiOperation, ApiBody, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';

@ApiTags('Tokens')
@Controller('tokens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TokensController {
  constructor(private readonly tokenUseCases: TokenUseCases) {}

  @ApiOperation({ summary: 'Create a new token' })
  @ApiBody({ type: CreateTokenDto })
  @Post()
  async createToken(@Body() createTokenDto: CreateTokenDto) {
    return this.tokenUseCases.createToken(createTokenDto);
  }

  @ApiOperation({ summary: 'Retrieve all tokens' })
  @ApiResponse({ status: 200, description: 'List of all tokens', type: [CreateTokenDto] })
  @Get()
  async getAllTokens() {
    return this.tokenUseCases.getAllTokens();
  }

  @Get(':id')
  async getTokenById(@Param('id') id: string) {
    const token = await this.tokenUseCases.getTokenById(id);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    return token;
  }

  @ApiOperation({ summary: 'Update a token by ID' })
  @ApiBody({ description: 'Update token data', type: UpdateTokenDto, required: true })
  @Put(':id')
  async updateToken(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
    const token = await this.tokenUseCases.getTokenById(id);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    if (updateTokenDto.hash) {
      throw new BadRequestException('Hash cannot be updated');
    }
    return this.tokenUseCases.updateToken(id, updateTokenDto);
  }

  @Delete(':id')
  async deleteToken(@Param('id') id: string) {
    const token = await this.tokenUseCases.getTokenById(id);
    if (!token) {
      throw new NotFoundException('Token not found');
    }
    await this.tokenUseCases.deleteToken(id);
    return { message: 'Token deleted successfully' };
  }
}