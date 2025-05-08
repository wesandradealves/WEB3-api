import { ProfileUserEnum } from '@/domain/commons/enum/profile.user.enum';
import { TransferStatusEnum } from '@/domain/commons/enum/transfer.status.enum';
import { IGetAvailableTransferUseCase } from '@/domain/interfaces/use-cases/transfer/get.available.transfer.use-case';
import { ITransferUseCase } from '@/domain/interfaces/use-cases/transfer/transfer.user-case';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';
import { Profile } from '@/modules/auth/profile/profile.decorator';
import { ProfileGuard } from '@/modules/auth/profile/profile.guard';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetAvailableTransfersDto } from './dtos/get.available.transfers.dto';

@ApiTags('Transfer Asset')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transfer-asset')
export class TrasferController {
  constructor(
    @Inject(ITransferUseCase)
    private readonly transferUseCase: ITransferUseCase,
    @Inject(IGetAvailableTransferUseCase)
    private readonly getAvailableTransferUseCase: IGetAvailableTransferUseCase,
  ) {}

  @ApiOperation({
    summary: 'Create asset transfer',
    description: 'Transfers assets to one or more recipients',
  })
  @ApiBody({
    description: 'Array of transfer IDs to process',
    type: Array,
    isArray: true,
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
      example: ['id1', 'id2', 'id3'],
    },
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
          example: [],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized - JWT token invalid or expired' })
  @ApiResponse({ status: 404, description: 'No transfer IDs were found' })
  @Profile(ProfileUserEnum.ADMIN)
  @UseGuards(ProfileGuard)
  @Post()
  async transfer(@Body() body: Array<string>, @Request() req: any): Promise<any> {
    return this.transferUseCase.execute(body, req.user.userId);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get of available transfers',
    description: 'Get list of available transfers',
  })
  @ApiQuery({ name: 'status', required: false, type: String, enum: TransferStatusEnum })
  @ApiResponse({
    status: 200,
    description: 'List of available transfers',
    type: [GetAvailableTransfersDto],
  })
  async getTransfers(
    @Request() req: any,
    @Query('status') status?: TransferStatusEnum,
  ): Promise<any> {
    return this.getAvailableTransferUseCase.execute(req.user.email, status);
  }
}
