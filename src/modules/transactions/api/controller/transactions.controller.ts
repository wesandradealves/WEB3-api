import { IGetTransactionsByWalletIdUseCase } from "@/domain/interfaces/use-cases/transactions/get.transactions.by.wallet.id.use-case";
import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TransactionsResponseDto } from "../dtos/transactions.reponse.dto";

@ApiTags('Transactions')
@Controller('transactions')
export class TransanctionsController {
  constructor(
    @Inject(IGetTransactionsByWalletIdUseCase)
    private readonly getTransactionsByWalletIdUseCase: IGetTransactionsByWalletIdUseCase,
  ) {}

  @Post('get-transactions-by-wallet')
  @ApiOperation({ summary: 'Get transactions by wallet id and username' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully.', type: TransactionsResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 404, description: 'Transactions not found.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        walletId: { type: 'number', example: 1 },
        username: { type: 'string', example: 'john_doe@teste.com.br' },
      },
    },
  })
  async getTransactionsByWalletId(
    @Body('walletId') walletId: number,
    @Body('username') username: string
  ): Promise<TransactionsResponseDto> {
    return await this.getTransactionsByWalletIdUseCase.execute(walletId, username);
  }
}