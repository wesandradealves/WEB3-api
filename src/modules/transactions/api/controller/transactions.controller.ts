import { IGetTransactionsByWalletIdUseCase } from "@/domain/interfaces/use-cases/transactions/get.transactions.by.wallet.id.use-case";
import { Body, Controller, Get, Inject } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

@Controller('transactions')
export class TransanctionsController {
  constructor(
    @Inject(IGetTransactionsByWalletIdUseCase)
    private readonly getTransactionsByWalletIdUseCase: IGetTransactionsByWalletIdUseCase,
  ) {}

  @Get('get-transactions-by-wallet')
  @ApiOperation({ summary: 'Get transactions by wallet id and username' })
  async getTransactionsByWalletId(
    @Body('walletId') walletId: number,
    @Body('username') username: string
  ) {
    return await this.getTransactionsByWalletIdUseCase.execute(walletId, username);
  }
}