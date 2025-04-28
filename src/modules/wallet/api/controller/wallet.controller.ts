import { JwtAuthGuard } from "@/modules/auth/jwt.auth.guard";
import { IGetUserWalletsUseCase } from "@/domain/interfaces/use-cases/wallets/get.user.wallets.use-case";
import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserWalletResponseDto } from "../dto/user.wallet.response.dto";

@ApiTags('Wallets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(
    @Inject(IGetUserWalletsUseCase)
    private readonly getUserWalletsUseCase: IGetUserWalletsUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get user wallets',
    description: 'Get all user wallets',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully response',
    type: UserWalletResponseDto,
  })
  async findUserWallets(
    @Query('email') email: string
  ): Promise<UserWalletResponseDto> {
    return await this.getUserWalletsUseCase.execute(email);
  }
}