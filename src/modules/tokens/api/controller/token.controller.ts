import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/jwt.auth.guard';
import { CreateTokenDto } from '../dto/create-token.dto';
import { UpdateTokenDto } from '../dto/update-token.dto';
import { CreateTokenUseCase } from '../../use-cases/create-token.use-case';
import { GetAllTokensUseCase } from '../../use-cases/get-all-tokens.use-case';
import { GetTokenByIdUseCase } from '../../use-cases/get-token-by-id.use-case';
import { UpdateTokenUseCase } from '../../use-cases/update-token.use-case';
import { DeleteTokenUseCase } from '../../use-cases/delete-token.use-case';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { TokenResponseDto } from '../dto/token.response.dto';

@ApiTags('Tokens')
@UseGuards(JwtAuthGuard)
@Controller('tokens')
export class TokenController {
  constructor(
    private readonly createTokenUseCase: CreateTokenUseCase,
    private readonly getAllTokensUseCase: GetAllTokensUseCase,
    private readonly getTokenByIdUseCase: GetTokenByIdUseCase,
    private readonly updateTokenUseCase: UpdateTokenUseCase,
    private readonly deleteTokenUseCase: DeleteTokenUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new token' })
  @ApiResponse({ status: 201, description: 'Token created successfully.', type: TokenResponseDto })
  @ApiBody({ type: CreateTokenDto })
  @Post()
  create(@Body() dto: CreateTokenDto) {
    return this.createTokenUseCase.execute(dto);
  }

  @ApiOperation({ summary: 'Retrieve all tokens' })
  @ApiResponse({ status: 200, description: 'List of tokens retrieved successfully.', type: TokenResponseDto, isArray: true })
  @Get()
  findAll() {
    return this.getAllTokensUseCase.execute();
  }

  @ApiOperation({ summary: 'Retrieve a token by ID' })
  @ApiResponse({ status: 200, description: 'Token retrieved successfully.', type: TokenResponseDto })
  @ApiParam({ name: 'id', required: true, description: 'ID of the token', schema: { type: 'string' } })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getTokenByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a token by ID' })
  @ApiResponse({ status: 200, description: 'Token updated successfully.', type: TokenResponseDto })
  @ApiParam({ name: 'id', required: true, description: 'ID of the token', schema: { type: 'string' } })
  @ApiBody({ type: UpdateTokenDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTokenDto) {
    return this.updateTokenUseCase.execute(id, dto);
  }

  @ApiOperation({ summary: 'Delete a token by ID' })
  @ApiResponse({ status: 200, description: 'Token deleted successfully.' })
  @ApiParam({ name: 'id', required: true, description: 'ID of the token', schema: { type: 'string' } })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteTokenUseCase.execute(id);
  }
}
