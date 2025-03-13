// filepath: /home/victor/dourado/dourado-dashboard-backend/src/modules/auth/api/controller/auth.controller.ts
import { ISignInUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.use-case';
import { Body, Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from '../../jwt.auth.guard';
import { SignInRequestDto } from '../dtos/signIn.request.dto';
import { ISignInRefreshTokenUseCase } from '@/domain/interfaces/use-cases/auth/signin.refresh.token.use-case';
import { ISignInUserSendTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.send.two.fa.use-case';
import { IVaidateTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/validate.two.fa.use-case';
import { SignInValidateTwoFaDto } from '../dtos/signIn.validate.twofa.dto';

@ApiTags('autentication')
@Controller('auths')
export class AuthController {
  constructor(
    @Inject(ISignInUseCase)
    private readonly signInUseCase: ISignInUseCase,
    @Inject(ISignInRefreshTokenUseCase)
    private readonly signInRefreshTokenUseCase: ISignInRefreshTokenUseCase,
    @Inject(ISignInUserSendTwoFaUseCase)
    private readonly signInUserSendTwoFaUseCase: ISignInUserSendTwoFaUseCase,
    @Inject(IVaidateTwoFaUseCase)
    private readonly vaidateTwoFaUseCase: IVaidateTwoFaUseCase,
  ) {}

  @Post('signin')
  @ApiOperation({ summary: 'Sign in a user' })
  @ApiBody({ type: SignInRequestDto })
  async signInOperator(@Body() data: SignInRequestDto) {
    return await this.signInUseCase.execute(data);
  }

  @Post('signin/refresh-token/validate')
  @UseGuards(RefreshJwtAuthGuard)
  @ApiOperation({ summary: 'Validate refresh token' })
  async signInRefreshToken(@Request() data: any) {
    return this.signInRefreshTokenUseCase.execute(data.user, data.user.token);
  }

  @Post('signin/send2fa')
  @ApiOperation({ summary: 'Send 2FA code' })
  @ApiBody({ type: SignInRequestDto })
  async signInSendTwoFa(@Body() data: SignInRequestDto) {
    return this.signInUserSendTwoFaUseCase.execute(data);
  }

  @Post('validate/2fa')
  @ApiOperation({ summary: 'Validate 2FA code' })
  async validaTwofa(@Body() data: SignInValidateTwoFaDto) {
    return this.vaidateTwoFaUseCase.execute(data.username, data.twofa);
  }
}