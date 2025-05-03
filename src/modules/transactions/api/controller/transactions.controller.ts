import { IGetTransactionsByWalletIdUseCase } from '@/domain/interfaces/use-cases/transactions/get.transactions.by.wallet.id.use-case';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';
import { Controller, Get, Inject, Query, Request, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransactionsDto } from '../dtos/transactions.dto';
import { TransactionsResponseDto } from '../dtos/transactions.reponse.dto';
import { IGetConsolidateTransactionsByWalletIdUseCase } from '@/domain/interfaces/use-cases/transactions/get.consolidate.transactions.by.wallet.id.use-case';
import { ConsolidateTransactionsDto } from '../dtos/consolidate-transactions.dto';
import { FileExportService, FileFormat } from '@/infrastructure/repositories/services/FileExportService';
import { Response } from 'express';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller('transactions')
export class TransanctionsController {
  constructor(
    @Inject(IGetTransactionsByWalletIdUseCase)
    private readonly getTransactionsByWalletIdUseCase: IGetTransactionsByWalletIdUseCase,
    @Inject(IGetConsolidateTransactionsByWalletIdUseCase)
    private readonly getConsolidateTransactionsByWalletIdUseCase: IGetConsolidateTransactionsByWalletIdUseCase,
    private readonly fileExportService: FileExportService, // Adicionar injeção do serviço
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

  @Get('consolidate/by-wallet-id/')
  async getConsolidateTransactionsByWalletId(
    @Query() data: ConsolidateTransactionsDto,
    @Request() request: any
  ): Promise<TransactionsResponseDto> {
    const {type, limit, after } = request.headers;
    const params = {type, limit, after, ...data}
    return await this.getConsolidateTransactionsByWalletIdUseCase.execute(params);
  }

  @Get('consolidate/download')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Download consolidated transactions as spreadsheet' })
  @ApiResponse({
    status: 200,
    description: 'File downloaded successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input or format.' })
  @ApiResponse({ status: 404, description: 'Transactions not found.' })
  async downloadConsolidateTransactions(
    @Query() data: any,
    @Request() request: any,
    @Res() response: Response
  ): Promise<void> {
    // Ensure that downloadFormat is set to EXCEL or CSV (default to Excel)
    if (!data.downloadFormat || data.downloadFormat === FileFormat.NONE) {
      data.downloadFormat = FileFormat.EXCEL;
    }

    const {type, limit, after } = request.headers;
    const params = {type, limit, after, ...data};
    
    // Get the data using the same use case
    const result = await this.getConsolidateTransactionsByWalletIdUseCase.execute(params);
    
    // Generate filename based on date and wallet ID
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `transactions_wallet_${data.walletId}_${currentDate}`;
    
    // Delegate to appropriate export method based on format
    if (data.downloadFormat === FileFormat.EXCEL) {
      await this.fileExportService.exportToExcel(result, filename, response);
    } else if (data.downloadFormat === FileFormat.CSV) {
      await this.fileExportService.exportToCSV(result, filename, response);
    } else {
      response.status(400).json({ message: 'Invalid download format' }); 
    }
  }
}