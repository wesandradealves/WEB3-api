import { TransferStatusEnum } from "@/domain/enums/transfer.status.enum";
import { IGetListAvailableTransferUseCase } from "@/domain/interfaces/use-cases/transfer/get.list.available.transfer.use-case";
import { ITransferUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.user-case";


import { AdminGuard } from "../admin.guard";
import { JwtAuthGuard } from "@/modules/auth/jwt.auth.guard";
import { Body, Controller, Get, Inject, Post, Query, Request, UseGuards } from "@nestjs/common";

import { GetListAvailableTransfersDto } from "./dtos/get.list.available.transfers.dto";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Transfer')
@ApiBearerAuth()
@Controller('transfer')
export class TrasferController {
  constructor(
    @Inject(ITransferUseCase)
    private readonly transferUseCase: ITransferUseCase,
    @Inject(IGetListAvailableTransferUseCase)
    private readonly getListAvailableTransferUseCase: IGetListAvailableTransferUseCase,
  ) {}

  @Post('create')  
  @UseGuards(AdminGuard)
  @ApiOperation({ 
    summary: 'Create asset transfer',
    description: 'Transfers assets to one or more recipients' 
  })
  @ApiBody({
    description: 'Array of transfer IDs to process',
    type: Array,
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'string'
      },
      example: ['id1', 'id2', 'id3']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Assets successfully queued for transfer',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'number', example: 200 },
        notFoundIds: { 
          type: 'array', 
          items: { type: 'string' },
          description: 'IDs that were not found in the database',
          example: [] 
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token invalid or expired' })
  @ApiResponse({ status: 404, description: 'No transfer IDs were found' })
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async transfer(
    @Body() body: Array<string>,
    @Request() req: any,
  ): Promise<any> {
    const result = await this.transferUseCase.execute(body, req.user);
    return result;
  }

  
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
}