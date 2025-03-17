import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IGetExtractByWalletIdUseCase } from "@/domain/interfaces/use-cases/extract/get.extract.by.wallet.id.use-case";
import { ExtractResponseDto } from "../dto/extract.reponse.dto";
import { JwtAuthGuard } from "@/modules/auth/jwt.auth.guard";
import { ExtractDto} from "../dto/extract.dto";

@ApiTags('Extract')
@ApiBearerAuth()
@Controller('extract')
export class ExtractController {
  constructor(
    @Inject(IGetExtractByWalletIdUseCase)
    private readonly getExtractByWalletIdUseCase: IGetExtractByWalletIdUseCase,
  ) {}

  @Get('by-wallet-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get extract by wallet ID' })
  @ApiResponse({ status: 200, description: 'Successful response', type: ExtractResponseDto })
  async getExtractByWalletId(
    @Query() data: ExtractDto
  ): Promise<ExtractResponseDto> {
    return await this.getExtractByWalletIdUseCase.execute(data);
  }
}