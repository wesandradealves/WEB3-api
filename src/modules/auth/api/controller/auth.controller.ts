import { ISignInUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.use-case';
import { Body, Controller, Get, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, RefreshJwtAuthGuard } from '../../jwt.auth.guard';
import { SignInRequestDto } from '../dtos/signIn.request.dto';
import { ISignInRefreshTokenUseCase } from '@/domain/interfaces/use-cases/auth/signin.refresh.token.use-case';

@Controller('auths')
export class AuthController {
  constructor(
    @Inject(ISignInUseCase)
    private readonly signInUseCase: ISignInUseCase,
    @Inject(ISignInRefreshTokenUseCase)
    private readonly signInRefreshTokenUseCase: ISignInRefreshTokenUseCase,
  ) {}

  @Post('signin')
  async signInOperator(@Body() data: SignInRequestDto) {
    return await this.signInUseCase.execute(data);
  }

  @Post('signin/refresh-token/validate')
  @UseGuards(RefreshJwtAuthGuard)
  async signInRefreshToken(@Request() data: any) {
    return this.signInRefreshTokenUseCase.execute(data.user, data.user.token);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get() {}
}
