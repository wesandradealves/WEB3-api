import { Body, Controller, Inject, Post, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { IGetExtractByWalletIdUseCase } from "@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case";
import { ExtractResponseDto } from "../dto/extract.reponse.dto";
import { JwtAuthGuard } from "@/modules/auth/jwt.auth.guard";

@ApiTags('Extract')
@ApiBearerAuth()
@Controller('extract')
export class ExtractController {
  constructor(
    @Inject(IGetExtractByWalletIdUseCase)
    private readonly getExtractByWalletIdUseCase: IGetExtractByWalletIdUseCase,
  ) {}

  @Post('get-extract-by-wallet-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get extract by wallet ID' })
  @ApiResponse({ status: 200, description: 'Successful response', type: ExtractResponseDto })
  @ApiBody({ schema: { 
    type: 'object', 
    properties: { 
      walletId: { type: 'number', example: 1 }, 
      username: { type: 'string', example: 'user123@email.com' } 
    } 
  }})
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getExtractByWalletId(
    @Body('walletId') walletId: number,
    @Body('username') username: string,
    @Query('limit') limit: number,
  ): Promise<ExtractResponseDto> {
    return await this.getExtractByWalletIdUseCase.execute(walletId, username, limit);
  }
}