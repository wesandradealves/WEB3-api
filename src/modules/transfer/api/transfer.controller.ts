import { ITransferUseCase } from "@/domain/interfaces/use-cases/transfer/transfer.user-case";
import { JwtAuthGuard } from "@/modules/auth/jwt.auth.guard";
import { Body, Controller, Inject, Post, Request, UseGuards } from "@nestjs/common";



@Controller('transfer')
export class TrasferController {
  constructor(
    @Inject(ITransferUseCase)
    private readonly transferUseCase: ITransferUseCase,
  ) {}

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