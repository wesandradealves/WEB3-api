import { ISendCsvToTransferUseCase } from '@/domain/interfaces/use-cases/transfer/send-csv-to-transfer.use-case';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';
import { Controller, Inject, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('transfer')
export class TransferController {
  constructor(
    @Inject(ISendCsvToTransferUseCase)
    private readonly sendCsvToTransferUseCase: ISendCsvToTransferUseCase,
  ) {}

  @Post('send-csv')  
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async sendCsvToBackend(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ): Promise<any> {
    const result = await this.sendCsvToTransferUseCase.execute(file, req.user.userId);
    return result;
  }
}