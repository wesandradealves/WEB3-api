import { ISendCsvUseCase } from '@/domain/interfaces/use-cases/update-file/send.csv.use-case';
import { JwtAuthGuard } from '@/modules/auth/jwt.auth.guard';
import { Controller, Inject, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(
    @Inject(ISendCsvUseCase)
    private readonly sendCsvToTransferUseCase: ISendCsvUseCase,
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