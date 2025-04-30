import { ISendCsvUseCase } from '@/domain/interfaces/use-cases/update-file/send.csv.use-case';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';
import { Controller, Inject, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  constructor(
    @Inject(ISendCsvUseCase)
    private readonly sendCsvToTransferUseCase: ISendCsvUseCase,
  ) {}

  @Post('transfer-asset/send/csv')  
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload CSV file for asset transfer', description: 'Uploads a CSV file containing asset transfer data' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV file to upload',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'File uploaded successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'File uploaded successfully',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async sendCsvToBackend(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<any> {
    return this.sendCsvToTransferUseCase.execute(file, req.user.userId);
  }
}