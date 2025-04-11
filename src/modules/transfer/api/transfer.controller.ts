import { ITransferUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.user-case";
import { Body, Controller, Inject, Post, Request, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AdminGuard } from "../admin.guard";

@ApiTags('Transfer')
@ApiBearerAuth()
@Controller('transfer')
export class TrasferController {
  constructor(
    @Inject(ITransferUseCase)
    private readonly transferUseCase: ITransferUseCase,
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
  async transfer(
    @Body() body: Array<string>,
    @Request() req: any,
  ): Promise<any> {
    const result = await this.transferUseCase.execute(body, req.user);
    return result;
  }
}