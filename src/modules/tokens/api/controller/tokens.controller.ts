import { ICreateTokenUseCase } from '@/domain/interfaces/use-cases/tokens/create.token.use-case';
import { IDeleteTokenUseCase } from '@/domain/interfaces/use-cases/tokens/delete.token.use-case';
import { IGetAllTokenUseCase } from '@/domain/interfaces/use-cases/tokens/getAll.token.use-case';
import { IGetTokenByIdUseCase } from '@/domain/interfaces/use-cases/tokens/getById.token.use-case';
import { IUpdateTokenUseCase } from '@/domain/interfaces/use-cases/tokens/update.token.use-case';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTokenDto } from '../dto/create-token.dto';
import { UpdateTokenDto } from '../dto/update-token.dto';

@ApiTags('Tokens')
@Controller('tokens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TokensController {
  constructor(
    @Inject(ICreateTokenUseCase)
    private readonly createTokenUseCase: ICreateTokenUseCase,

    @Inject(IUpdateTokenUseCase)
    private readonly updateTokenUseCase: IUpdateTokenUseCase,

    @Inject(IDeleteTokenUseCase)
    private readonly deleteTokenUseCase: IDeleteTokenUseCase,

    @Inject(IGetAllTokenUseCase)
    private readonly getAllTokenUseCase: IGetAllTokenUseCase,

    @Inject(IGetTokenByIdUseCase)
    private readonly getTokenByIdUseCase: IGetTokenByIdUseCase,
  ) {}

  @ApiOperation({ summary: 'Create a new token' })
  @ApiBody({ type: CreateTokenDto })
  @Post()
  async createToken(@Body() createTokenDto: CreateTokenDto) {
    return this.createTokenUseCase.execute(createTokenDto);
  }

  @ApiOperation({ summary: 'Retrieve all tokens' })
  @ApiResponse({ status: 200, description: 'List of all tokens', type: [CreateTokenDto] })
  @Get()
  async getAllTokens() {
    return this.getAllTokenUseCase.execute();
  }

  @Get(':id')
  async getTokenById(@Param('id') id: string) {
    return await this.getTokenByIdUseCase.execute(id);
  }

  @ApiOperation({ summary: 'Update a token by ID' })
  @ApiBody({ description: 'Update token data', type: UpdateTokenDto, required: true })
  @HttpCode(200)
  @Patch(':id')
  async updateToken(@Param('id') id: string, @Body() updateTokenDto: UpdateTokenDto) {
    return this.updateTokenUseCase.execute(id, updateTokenDto);
  }

  @Delete(':id')
  async deleteToken(@Param('id') id: string) {
    await this.deleteTokenUseCase.execute(id);
  }
}
