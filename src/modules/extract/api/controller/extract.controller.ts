import { Body, Controller, Get, Inject, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { IGetExtractByWalletIdUseCase } from "@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case";
import { ExtractResponseDto } from "../dto/extract.reponse.dto";

@ApiTags('Extract')
@Controller('extract')
export class ExtractController {
  constructor(
    @Inject(IGetExtractByWalletIdUseCase)
    private readonly getExtractByWalletIdUseCase: IGetExtractByWalletIdUseCase,
  ) {}

  @Get('get-extract-by-wallet-id')
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