import { TransferStatusEnum } from "@/domain/enums/transfer.status.enum";
import { IGetListAvailableTransferUseCase } from "@/domain/interfaces/use-cases/transfer/get.list.available.transfer.use-case";
import { ITransferUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.user-case";
import { JwtAuthGuard } from "@/modules/auth/jwt.auth.guard";
import { Body, Controller, Get, Inject, Post, Query, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { GetListAvailableTransfersDto } from "./dtos/get.list.available.transfers.dto";



@Controller('transfer')
export class TrasferController {
  constructor(
    @Inject(ITransferUseCase)
    private readonly transferUseCase: ITransferUseCase,
    @Inject(IGetListAvailableTransferUseCase)
    private readonly getListAvailableTransferUseCase: IGetListAvailableTransferUseCase,
  ) {}

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get list of available transfers',
    description: 'Get list of available transfers',
  })
  @ApiQuery({ name: 'status', required: false, type: String, enum: TransferStatusEnum })
  @ApiResponse({
    status: 200,
    description: 'List of available transfers',
    type: [GetListAvailableTransfersDto],
  })
  async getListAvailableTransfers(
    @Request() req: any,
    @Query('status') status?: TransferStatusEnum,
  ): Promise<any> {
    const result = await this.getListAvailableTransferUseCase.execute(req.user.email, status);
    return result;
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async transfer(
    @Body() body: any,
    @Request() req: any,
  ): Promise<any> {
    const result = await this.transferUseCase.execute(body, req.user);
    return result;
  }
}