// filepath: /home/victor/dourado/dourado-dashboard-backend/src/modules/auth/api/controller/auth.controller.ts
import { ISignInRefreshTokenUseCase } from '@/domain/interfaces/use-cases/auth/signin.refresh.token.use-case';
import { ISignInUserSendTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.send.two.fa.use-case';
import { IValidateTwoFaUseCase } from '@/domain/interfaces/use-cases/auth/validate.two.fa.use-case';
import {
  Body,
  Controller,
  HttpCode,
  Inject,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RefreshJwtAuthGuard } from '../../jwt.auth.guard';
import { SignInRequestDto } from '../dtos/signIn.request.dto';
import { SignInValidateTwoFaDto } from '../dtos/signIn.validate.twofa.dto';

@ApiTags('Authentication')
@Controller('auths')
export class AuthController {
  constructor(
    @Inject(ISignInRefreshTokenUseCase)
    private readonly signInRefreshTokenUseCase: ISignInRefreshTokenUseCase,
    @Inject(ISignInUserSendTwoFaUseCase)
    private readonly signInUserSendTwoFaUseCase: ISignInUserSendTwoFaUseCase,
    @Inject(IValidateTwoFaUseCase)
    private readonly vaidateTwoFaUseCase: IValidateTwoFaUseCase,
  ) {}

  @HttpCode(200)
  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user and password and send 2FA code' })
  @ApiBody({ type: SignInRequestDto })
  async signInSendTwoFa(@Body() data: SignInRequestDto) {
    return this.signInUserSendTwoFaUseCase.execute(data);
  }

  @Post('signin/refresh-token/validate')
  @ApiBearerAuth()
  @UseGuards(RefreshJwtAuthGuard)
  @ApiOperation({ summary: 'Validate refresh token' })
  async signInRefreshToken(@Request() data: any) {
    return this.signInRefreshTokenUseCase.execute(data.user, data.user.token);
  }

  @Post('validate/2fa')
  @ApiOperation({ summary: 'Validate 2FA code' })
  async validaTwofa(@Body() data: SignInValidateTwoFaDto) {
    return this.vaidateTwoFaUseCase.execute(data.username, data.twofa);
  }
}
