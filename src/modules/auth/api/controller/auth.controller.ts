import { ISignInUseCase } from '@/domain/interfaces/use-cases/auth/signin.user.use-case';
import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../jwt.auth.guard';
import { SignInRequestDto } from '../dtos/signIn.request.dto';

@Controller('auths')
export class AuthController {
  constructor(
    @Inject(ISignInUseCase)
    private readonly signInUseCase: ISignInUseCase,
  ) {}

  @Post('signin')
  async signInOperator(@Body() data: SignInRequestDto) {
    return this.signInUseCase.execute(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async get() {}
}
