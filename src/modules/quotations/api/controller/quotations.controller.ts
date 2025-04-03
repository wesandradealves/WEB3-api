import { IGetQuotationsUseCase } from '@/domain/interfaces/use-cases/quotations/get.quotations.use-case';
import { IQuoteInformationUseCase } from '@/domain/interfaces/use-cases/quotations/quote.information.use-case';
import { 
  Controller,
  Get,
  Inject,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetQuotationsResponseDto } from '../dto/get.quotations.response.dto';
import { QuotationInformationResponseDto } from '../dto/quote.information.response.dto';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';

@ApiTags('Quotations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quotations')
export class QuotationsController {
  constructor(
    @Inject(IGetQuotationsUseCase)
    private readonly getQuotationsUseCase: IGetQuotationsUseCase,
    @Inject(IQuoteInformationUseCase)
    private readonly quoteInformationUseCase: IQuoteInformationUseCase,
  ){}
  
  @Get()
  @ApiOperation({
    summary: 'Get quotations',
    description: 'Get all quotations'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully response',
    type: GetQuotationsResponseDto,
  })
  async findQuotations(@Query('email') email: string): Promise<GetQuotationsResponseDto> {
    return await this.getQuotationsUseCase.execute(email);
  }

  @Get('quote/info')
  @ApiOperation({
    summary: 'Get quote information',
    description: 'Get quote information by asset'
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully response',
    type: QuotationInformationResponseDto,
  })
  async findQuoteInformation(@Query('email') email: string, @Query('asset') asset: string): Promise<QuotationInformationResponseDto> {
    return await this.quoteInformationUseCase.execute(email, asset);
  }
}
