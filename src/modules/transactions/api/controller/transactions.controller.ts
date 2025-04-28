import { IGetTransactionsByWalletIdUseCase } from '@/domain/interfaces/use-cases/transactions/get.transactions.by.wallet.id.use-case';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsDto } from '../dtos/transactions.dto';
import { TransactionsResponseDto } from '../dtos/transactions.reponse.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransanctionsController {
  constructor(
    @Inject(IGetTransactionsByWalletIdUseCase)
    private readonly getTransactionsByWalletIdUseCase: IGetTransactionsByWalletIdUseCase,
  ) {}

  @Get('by-wallet-id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get transactions by wallet id and username' })
  @ApiResponse({
    status: 200,
    description: 'Transactions retrieved successfully.',
    type: TransactionsResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Transactions not found.' })
  async getTransactionsByWalletId(
    @Query() data: TransactionsDto,
  ): Promise<TransactionsResponseDto> {
    return await this.getTransactionsByWalletIdUseCase.execute(data);
  }
}
