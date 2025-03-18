import { IGetExtractByWalletIdUseCase } from '@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExtractResponseDto } from '../dto/extract.reponse.dto';
import { ExtractRequestDto } from '../dto/extract.request.dto';

@ApiTags('Extract')
@ApiBearerAuth()
@Controller('extracts')
export class ExtractController {
  constructor(
    @Inject(IGetExtractByWalletIdUseCase)
    private readonly getExtractByWalletIdUseCase: IGetExtractByWalletIdUseCase,
  ) {}

  @Get('by-wallet-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get extract by wallet ID' })
  @ApiResponse({
    status: 200,
    description: 'Successfully response',
    type: ExtractResponseDto,
  })
  async extractByWalletId(
    @Query() query: ExtractRequestDto,
  ): Promise<ExtractResponseDto> {
    return await this.getExtractByWalletIdUseCase.execute(query);
  }
}
